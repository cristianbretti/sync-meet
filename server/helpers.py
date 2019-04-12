from flask import jsonify, request
from model import db, User, Planning_group
import config
from datetime import datetime, time
from datetime import timedelta
from contextlib import contextmanager
from functools import wraps, cmp_to_key
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests
from googleapiclient.discovery import build
from oauth2client.client import AccessTokenCredentials
import numpy as np
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
            user = User.query.filter_by(
                google_id=request.headers['google_id']).first()
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
            group = Planning_group.query.filter_by(
                group_str_id=group_str_id).first()
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
        idinfo = google_id_token.verify_oauth2_token(
            id_token, requests.Request(), config.CLIENT_ID)
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
    time interval defined by group parameter and True.
    Returns user id and False if the access token has expired.
    """
    try:
        credentials = AccessTokenCredentials(access_token, 'my-user-agent/1.0')
        service = build('calendar', 'v3', credentials=credentials)

        all_calendars = service.calendarList().list().execute()
        all_calendars = all_calendars.get('items', [])
        calendar_ids = [cal['id'] for cal in all_calendars]

        # Find all events between timeMin and timeMax in timezone CET +01:00
        timeMin = datetime.combine(
            group.from_date, group.from_time).isoformat() + "+01:00"
        timeMax = datetime.combine(
            group.to_date, group.to_time).isoformat() + "+01:00"

        # For every calenderId, find all relevant events
        all_events = []
        for cal_id in calendar_ids:
            events = service.events().list(calendarId=cal_id,
                                           timeMin=timeMin,
                                           timeMax=timeMax,
                                           timeZone="CET"
                                           ).execute()
            for event in events.get('items'):
                if 'start' in event.keys() and 'end' in event.keys() and 'dateTime' in event['start'].keys():
                    start = datetime.strptime(
                        event['start']['dateTime'][:-9], "%Y-%m-%dT%H:%M%S")
                    end = datetime.strptime(
                        event['end']['dateTime'][:-9], "%Y-%m-%dT%H:%M%S")
                    all_events.append({
                        'start': start,
                        'end': end,
                        'user_id': user.id,
                    })
    except:
        return user.id, False
    return all_events, True


def create_interval(event):
    """ Convert an event dict 
    {
        start: datetime,
        end: datetime
    }
    to an Interval
    """
    return I.closed(event['start'], event['end'])


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
    event_on_days = dict()
    days = []
    # Create one whole interval for each day
    current_day = group.from_date
    while current_day != group.to_date + timedelta(days=1):
        days.append(current_day)
        event_on_days[str(current_day)] = []
        current_day = current_day + timedelta(days=1)

    for event in all_events:
        event_on_days[str(event['start'].date())].append(event)

    day_start = (group.from_time.hour * 60 + group.from_time.minute)

    n_days = len(days)
    n_minutes = (group.to_time.hour - group.from_time.hour) * \
        60 + (group.to_time.minute - group.from_time.minute)
    free_table = np.zeros((n_days, n_minutes))

    for idx, day in enumerate(days):
        for event in event_on_days[str(day)]:
            start_idx = event['start'].hour * 60 + event['start'].minute - \
                day_start
            end_idx = event['end'].hour * 60 + event['end'].minute - \
                day_start
            free_table[idx, start_idx:end_idx] += 1

    result = []
    all_but_one = []
    for day_idx, day in enumerate(days):
        free = True
        row = free_table[day_idx, :]
        zeros = [[0, -1]]
        zeros_ab1 = []
        for min_idx, val in enumerate(row):
            if val >= 1 and free:
                free = False
                zeros[-1][1] = min_idx
                if val == 1:
                    zeros_ab1.append([min_idx, -1])
            elif val == 0 and not free:
                free = True
                zeros.append([min_idx, -1])
                if len(zeros_ab1) > 0:
                    zeros_ab1[-1][1] = min_idx
            elif min_idx == len(row) - 1:
                if free:
                    zeros[-1][1] = min_idx
                elif val == 1:
                    zeros_ab1[-1][1] = min_idx
        for i in range(len(zeros)):
            from_time = zeros[i][0] + day_start
            from_time = time(int(from_time / 60), from_time % 60)
            to_time = zeros[i][1] + day_start
            to_time = time(int(to_time / 60), to_time % 60)
            result.append({
                'date': str(day),
                'from_time': str(from_time)[:-3],
                'to_time': str(to_time)[:-3]
            })
        for i in range(len(zeros_ab1)):
            from_time = zeros_ab1[i][0] + day_start
            from_time = time(int(from_time / 60), from_time % 60)
            to_time = zeros_ab1[i][1] + day_start
            to_time = time(int(to_time / 60), to_time % 60)
            all_but_one.append({
                'date': str(day),
                'from_time': str(from_time)[:-3],
                'to_time': str(to_time)[:-3]
            })

    return result, all_but_one
