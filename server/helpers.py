from flask import jsonify, request
from model import db, User, Planning_group
import config
from datetime import datetime, time, tzinfo
from datetime import timedelta
from contextlib import contextmanager
from functools import wraps, cmp_to_key
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests
from googleapiclient.discovery import build
from oauth2client.client import AccessTokenCredentials
import numpy as np
import pytz
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
    except:
        # TODO: uncomment!!
        raise APIError(jsonify({'error': "Internal server error"}), 500)


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
            return (jsonify({'error': "This group does not exist"}), 403)
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
        raise ValueError('Could not authenticate google account')
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
        tz = pytz.timezone('Europe/Stockholm')
        timeMin = tz.localize(datetime.combine(
            group.from_date, group.from_time)).astimezone(tz).isoformat()
        timeMax = tz.localize(datetime.combine(
            group.to_date, group.to_time)).astimezone(tz).isoformat()

        # For every calenderId, find all relevant events
        all_events = []
        for cal_id in calendar_ids:
            events = service.events().list(calendarId=cal_id,
                                           timeMin=timeMin,
                                           timeMax=timeMax,
                                           timeZone=str(tz),
                                           singleEvents=True
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
    except Exception as e:
        return user.id, False
    return all_events, True


def toMinutes(time):
    return (time.hour * 60 + time.minute)


def back_to_event(minute_interval, day_start):
    from_time = minute_interval[0] + day_start
    from_time = time(int(from_time / 60), from_time % 60)
    to_time = minute_interval[1] + day_start
    to_time = time(int(to_time / 60), to_time % 60)
    return {
        'from_time': str(from_time)[:-3],
        'to_time': str(to_time)[:-3]
    }


def find_free_time(all_events, group):
    """ Calculates all the free time slots.
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

    day_start = toMinutes(group.from_time)
    n_days = len(days)
    n_minutes = toMinutes(group.to_time) - toMinutes(group.from_time)
    free_table = np.zeros((n_days, n_minutes))
    meeting_length = toMinutes(group.meeting_length)

    for idx, day in enumerate(days):
        for event in event_on_days[str(day)]:
            start_idx = max(0, toMinutes(event['start']) - day_start)
            end_idx = min(free_table.shape[1], toMinutes(
                event['end']) - day_start)
            free_table[idx, start_idx:end_idx] += 1

    result = dict()
    secondary_result = dict()
    for day_idx, day in enumerate(days):
        free = False
        row = free_table[day_idx, :]
        primary = []
        secondary = []
        for idx, val in enumerate(row):
            if val >= 1 and free:
                # 0 -> >1
                free = False
                if idx - primary[-1][0] >= meeting_length:
                    primary[-1][1] = idx
                    if val == 1:
                        secondary.append([idx, -1])
                else:
                    discard = primary.pop()
                    if val == 1:
                        # new secondary from discard start
                        # since we know its been all zeros up to here
                        secondary.append(discard)
            elif val == 0 and not free:
                # >1 | init -> 0
                free = True
                primary.append([idx, -1])
                if len(secondary) > 0 and idx - secondary[-1][0] >= meeting_length:
                    secondary[-1][1] = idx
                elif len(secondary) > 0:
                    secondary.pop()
            elif idx == 0 and val == 1:
                # init -> 1
                secondary.append([idx, -1])
            elif idx == len(row) - 1:
                # last
                if free and idx + 1 - primary[-1][0] >= meeting_length:
                    primary[-1][1] = idx + 1
                elif val == 1 and idx + 1 - secondary[-1][0] >= meeting_length:
                    secondary[-1][1] = idx + 1

        result[str(day)] = []
        secondary_result[str(day)] = []
        for minute_interval in primary:
            result[str(day)].append(back_to_event(
                minute_interval, day_start))
        for minute_interval in secondary:
            secondary_result[str(day)].append(back_to_event(
                minute_interval, day_start))

    return result, secondary_result
