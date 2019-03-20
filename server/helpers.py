from flask import jsonify, request
from model import db, User, Planning_group
import config
from datetime import datetime
from datetime import timedelta
from contextlib import contextmanager
from functools import wraps, cmp_to_key
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests
from googleapiclient.discovery import build
from oauth2client.client import AccessTokenCredentials
from sympy import Interval, Union, Complement
import sympy as sp
import re

""" HELPERS """
class APIError(Exception):
    def __init__(self, response, code):
        super(APIError, self).__init__()
        self.response = response
        self.code = code

@contextmanager
def handle_exceptions():
    """ Create a context that allows us to catch API
    errors and handle them correctly.
    Usage: 
    with handle_exceptions():
        do stuff
    """
    try:
        yield
    except ValueError as e:
        raise APIError(jsonify({'error': str(e)}), 400)
    except KeyError as e:
        raise APIError(jsonify({'error': "Missing parameter: " + str(e)}), 400)
    # except:
    #     raise APIError(jsonify({'error': "Internal server error"}), 500) #TODO: uncomment!!


def attempt_delete_user(user):
    """ Deletes the user if it does
    not belong to any group.
    """
    if len(user.planning_group) == 0:
        db.session.delete(user)

def require_login(func):
    """ Function wrapper that finds the 
    user is in the database. 
    Returns 403 if user does not exist.
    """
    @wraps(func) 
    def check_login(*args, **kwargs):
        try:
            # Authenticated with database
            user = User.query.filter_by(google_id=request.headers['google_id']).first()
            if user is None:
                raise Exception
        except:
            return jsonify({'error': "Access denied"}), 403
        return func(*args, **kwargs, user=user)
    return check_login

def require_group_str_id(func):
    """ Function wrapper that finds the group
    identified by the group_str_id in the 
    request header. If no header is found, or the 
    group is not found, return 403. 
    """
    @wraps(func) 
    def check_group_str_id(*args, **kwargs):
        try:
            group_str_id = request.headers['group_str_id']
            group = Planning_group.query.filter_by(group_str_id=group_str_id).first()
            if group is None:
                raise Exception
        except Exception:
            return (jsonify({'error': "Invalid group_str_id header"}), 403)
        return func(*args, **kwargs, group=group)
    return check_group_str_id


def validate_datetimes(from_date, to_date, from_time, to_time, meeting_length):
    if from_date < datetime.now().date():
        raise ValueError("Cannot plan a meeting in the past")
    if to_date < from_date or to_time <= from_time:
        raise ValueError("Cannot plan a meeting going backwards in time")
    if to_date > datetime.now().date() + timedelta(days=360):
        raise ValueError("Cannot plan a meeting more than a year from now")

def create_or_find_user(id_token, name, access_token):
    """ Input checking and id_token authentication towards
    googles api to verify user identity. If the user already 
    exists in the database, update the access_token and return 
    said user. Otherwise create a new user. 
    """
    if len(name) > 30:
        raise ValueError("User name too long. Max 30 characters")
    # Validate google_id token
    try:
        idinfo = google_id_token.verify_oauth2_token(id_token, requests.Request(), config.CLIENT_ID)
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
    except:
        raise ValueError('Could not authenticate id_token')
    google_id = idinfo['sub']
    # Check if user exists
    new_user = User.query.filter_by(google_id=google_id).first()
    if new_user is None:
        # Create new user
        new_user = User(google_id, name, access_token)
        db.session.add(new_user)
    else:
        # User found, update auth token
        new_user.access_token = access_token
        new_user.name = name
    return new_user

def get_events(access_token, group, user):
    """ Return all the events on calendars that matches the
    time interval defined by group parameter. 
    """
    try: 
        credentials = AccessTokenCredentials(access_token, 'my-user-agent/1.0')
        service = build('calendar', 'v3', credentials=credentials)
        
        all_calendars = service.calendarList().list().execute()
        all_calendars = all_calendars.get('items', [])
        calendar_ids = [cal['id'] for cal in all_calendars]
        
        # Find all events between timeMin and timeMax in timezone CET +01:00
        timeMin = datetime.combine(group.from_date, group.from_time).isoformat() + "+01:00"
        timeMax = datetime.combine(group.to_date, group.to_time).isoformat() + "+01:00"

        # For every calenderId, find all relevant events
        all_events = []
        for cal_id in calendar_ids:
            events = service.events().list(calendarId=cal_id,
                timeMin=timeMin,
                timeMax=timeMax,
                timeZone="CET"
                ).execute()
            for event in events.get('items'):
                start = datetime.strptime(event['start']['dateTime'][:-9], "%Y-%m-%dT%H:%M%S")
                end = datetime.strptime(event['end']['dateTime'][:-9], "%Y-%m-%dT%H:%M%S")
                all_events.append({
                    'start': start,
                    'end': end,
                })
    except:
        raise ValueError("Access token expired for user: " + str(user.id))
    return all_events


def create_interval(event):
    """ Convert an event dict 
    {
        start: datetime,
        end: datetime
    }
    to an Sympy Interval
    """
    start_str = str(event['start'])
    end_str = str(event['end'])
    start_str = re.sub("[-\s:]", "", start_str)[:-2]
    end_str = re.sub("[-\s:]", "", end_str)[:-2]
    return Interval(int(start_str), int(end_str))

def interval_to_datetime(interval):
    """ Convert a Sympy Inverval 
    to an dict 
    {
        start: datetime,
        end: datetime
    }
    """
    return {
        'start': datetime.strptime(str(interval.start), "%Y%m%d%H%M"),
        'end': datetime.strptime(str(interval.end), "%Y%m%d%H%M")
    }

def find_free_time(all_events, group):
    """ Calculates all the free time slots
    by taking the union of all events (B),
    and then taking the complement A - B 
    where A is the Interval of the whole day. 
    Return a list of free time slots on the form
    {
        date: YYYY-MM-DD,
        from_time: HH:MM
        to_time: HH:MM
    }
    """
    intervals = [create_interval(event) for event in all_events]

    # Take the union of all events
    event_union = Union(intervals)

    # Create one whole interval for each day
    whole_day_intervals = []
    current_day = group.from_date
    while current_day != group.to_date + timedelta(days=1):
        start = datetime.combine(current_day, group.from_time)
        end = datetime.combine(current_day, group.to_time)
        whole_day_intervals.append(create_interval({'start': start, 'end': end}))
        current_day = current_day + timedelta(days=1)

    # The free time is A - B where A is the whole day and B are the events
    free_time_intervals = Complement(Union(whole_day_intervals), event_union)

    # If only one interval, convert to list
    free_time_list = []
    if isinstance(free_time_intervals.args[0], sp.numbers.Integer):
        free_time_list.append(Interval(free_time_intervals.args[0],free_time_intervals.args[1]))
    else:
        for interval in free_time_intervals.args:
            free_time_list.append(interval)

    result = []
    for time_slot in free_time_list:
        free_event = interval_to_datetime(time_slot)
        diff = free_event['end'] - free_event['start']
        meeting_len = timedelta(hours=group.meeting_length.hour, minutes=group.meeting_length.minute)
        # Check that the free interval is long enought for the meeting
        if diff > meeting_len:
            result.append({
                'date': str(free_event['start'].date()),
                'from_time': str(free_event['start'].time())[:-3],
                'to_time': str(free_event['end'].time())[:-3]
            })
    return result