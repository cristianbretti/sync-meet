from flask import jsonify, session, request
from model import db, User, Planning_group
import config
from contextlib import contextmanager
from functools import wraps
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests
from googleapiclient.discovery import build
from oauth2client.client import AccessTokenCredentials

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
        if user.google_id == session['google_id']:
            # log out user
            session.pop('google_id', None)

def require_login(func):
    """ Function wrapper that authenticate the user by first 
    checking session cookie. If not authenticated by cookie, 
    authenticate with database.
    """
    @wraps(func) 
    def check_login(*args, **kwargs):
        try:
            if 'google_id' in session and session['google_id'] == request.headers['google_id']:
                # Authenticated by cookie
                pass
            else:
                user = User.query.filter_by(google_id=request.headers['google_id']).first()
                if user is None:
                    raise Exception
                # Authenticated by database, update cookie
                session['google_id'] = user.google_id
        except:
            return jsonify({'error': "Access denied"}), 403
        return func(*args, **kwargs)
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


def create_or_find_user(id_token, name, access_token):
    """ Input checking and id_token authentication towards
    googles api to verify user identity. If the user already 
    exists in the database, update the access_token and return 
    said user. Otherwise create a new user. 
    Also sets the sessios cookie for future authentication. 
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
    session['google_id'] = new_user.google_id
    return new_user

def get_events(access_token, group):
    """ Return all the events on ?all? calendars that matches the
    time interval defined by group parameter. 
    """
    #TODO: get the calendar for a user towards the google API
    credentials = AccessTokenCredentials(access_token, 'my-user-agent/1.0')
    service = build('calendar', 'v3', credentials=credentials)
    all_calendars = service.calendarList().list().execute()
    return {'calendar': all_calendars}