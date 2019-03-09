from flask import Flask, render_template, request, jsonify, session
from flask_session import Session
from flask_socketio import SocketIO, send, join_room, leave_room, close_room
from model import db, admin, User, Planning_group
import config
from helpers import *
import os
import tempfile
import json
from datetime import datetime
import random
import string

# File paths
root_path = os.path.realpath(os.path.join(os.path.abspath(os.path.dirname(__file__)), '..'))
db_path = os.path.join(root_path, 'db', 'syncmeet.db')
db_uri = 'sqlite:///{}'.format(db_path)
static_folder_path = os.path.join(root_path, 'client', 'build', 'static')
template_folder_path = os.path.join(root_path, 'client', 'build')

app = Flask(__name__, static_folder=static_folder_path, template_folder=template_folder_path)
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # To supress a warning
app.config['SECRET_KEY'] = config.MY_SECRET
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_NAME'] = 'session_id'

Session(app)
sio = SocketIO(manage_session=False)


""" dev only """
from flask_cors import CORS, cross_origin
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, supports_credentials=True)
""" end """

def create_prod_app(app):
    """ Initialize the database and admin.
    """
    db.init_app(app)
    admin.init_app(app)
    sio.init_app(app)

def create_test_app(app):
    """ Sets up the correct config
    for testing the app. 
    Change the database used to test.db
    and initialize it. 
    """
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}'.format(os.path.join(root_path, 'db', 'test.db'))
    app.config['SECRET_KEY'] = "testsecret"
    db.init_app(app)
    return app

""" SOCKET IO """
# @sio.on('message')
# def handleMessage(msg):
#     print('Message: ' + msg)
#     send(msg, broadcast=True)

@sio.on('connect')
def connect_user():
    session['sid'] = request.sid
    session['namespace'] = request.namespace
    print(session)

""" API ENDPOINTS """

@app.route('/api/test', methods=['POST'])
def test():
    print("IN HERE")
    print(session)
    session['test'] = request.json['test']
    return jsonify("test"), 200

# Example payload
# {
# 	"group_name":"test_group",
# 	"from_date":"2019-11-20",
# 	"to_date":"2019-11-21",
# 	"from_time":"10:00",
# 	"to_time":"18:00",
# 	"meeting_length":"01:00",
#   "user_name":"test_user",
# 	"access_token":"test_token",
#   "id_token":"googles long token id in response.getAuthResponse().id_token"
# }
@app.route('/api/creategroup', methods=['POST'])
def create_group():
    """ Creates a group with the owner being the user
    that is included in the POST. 

    Returns a json with:
    group_str_id: 16 chars identifies the newly created group 
    google_id: identifies the owner of the new group
    """
    try:
        with handle_exceptions():
            sid = session['sid']
            namespace = session['namespace']
            payload = request.json
            if payload is None:
                raise ValueError("Missing json body in post")
            # get group params
            group_name = payload['group_name']
            from_date = datetime.strptime(payload['from_date'], '%Y-%m-%d').date()
            to_date = datetime.strptime(payload['to_date'], '%Y-%m-%d').date()
            from_time = datetime.strptime(payload['from_time'], '%H:%M').time()
            to_time = datetime.strptime(payload['to_time'], '%H:%M').time()
            meeting_length = datetime.strptime(payload['meeting_length'], '%H:%M').time()
            # input checking
            validate_datetimes(from_date, to_date, from_time, to_time, meeting_length)
            # get user params
            user_name = payload['user_name']
            id_token = payload['id_token']
            access_token = payload['access_token']
            # Create or find user
            user = create_or_find_user(id_token, user_name, access_token)
            if len(user.owner) >= 10:
                raise ValueError("You cannot have more than 10 groups active per user.")
            # Create group
            if len(group_name) > 30:
                raise ValueError("Group name too long. Max 30 characters")
            new_group_str_id = ''.join(random.SystemRandom().choice(string.ascii_lowercase + string.digits) for _ in range(16))
            new_group = Planning_group(
                new_group_str_id,
                group_name,
                from_date,
                to_date,
                from_time,
                to_time,
                meeting_length,
                user
            )
            db.session.add(new_group)
            db.session.commit()
            new_group.users.append(user)
            db.session.commit()
            # Join the socket-io room 
            join_room(new_group.group_str_id, sid=sid, namespace=namespace)
            return jsonify({
                'group_str_id': new_group.group_str_id,
                'google_id': user.google_id
                }), 201
    except APIError as e:
        return e.response, e.code


# Example payload:
# headers:
# {
#   "group_str_id":"the group str id from the address bar"
# }
# {
# 	"name":"test_user",
# 	"access_token":"test_token",
#   "id_token":"googles long token id in response.getAuthResponse().id_token"
# }
@app.route('/api/adduser', methods=['POST'])
@require_group_str_id
def add_user(group=None):
    """ Adds a user to the group identified by
    the group_str_id in the request header.

    Returns json with:
    google_id that identifies the user added to the group
    """
    try:
        with handle_exceptions():
            if 'sid' not in session or 'namespace' not in session:
                raise ValueError("Missing session values")
            sid = session['sid']
            namespace = session['namespace']
            payload = request.json
            if payload is None:
                raise ValueError("Missing json body in post")
            name = payload['name']
            id_token = payload['id_token']
            access_token = payload['access_token']
            user = create_or_find_user(id_token, name, access_token)
            group.users.append(user)
            db.session.commit()
            # Join the socket-io room group_str_id
            join_room(group.group_str_id, sid=sid, namespace=namespace)
            # Notify all in that room
            send("New user joined", room=group.group_str_id, sid=sid, namespace=namespace)
            return jsonify({'google_id': user.google_id}), 200
    except APIError as e:
        return e.response, e.code

# Example payload
# headers:
# {
#   "group_str_id":"the group str id from the address bar"
#   "google_id":"user google id"
# }
@app.route('/api/getusersfromgroup')
@require_login
@require_group_str_id
def get_users_from_group(user=None, group=None):
    """ Returns all the users in the group identified by 
    the group_str_id in the request headers.
    Id refers to id in our database, not google_id. 
    This is because we use google_id as identification,
    and can therefore not share it. 
    """
    try:
        with handle_exceptions():
            users = [ {'name': user.name, 'id': user.id} for user in group.users]
            return jsonify({
                'users': users,
                'owner': {'name': group.owner.name, 'id': group.owner.id}
                }), 200
    except APIError as e:
        return e.response, e.code


# Example payload
# headers:
# {
#   "group_str_id":"the group str id from the address bar"
#   "google_id":"user google id"
# }
@app.route('/api/getgroupcalendar')
@require_login
@require_group_str_id
def get_group_calendar(user=None, group=None):
    """ Returns time slots were all group
    memebers are free. 
    """
    try:
        with handle_exceptions():
            calendars = [get_events(g_user.access_token, group) for g_user in group.users]
            # TODO: calculate free time and return new calendar
            return jsonify({'calendar': calendars}), 200
    except APIError as e:
        return e.response, e.code


# Example payload
# headers:
# {
#   "group_str_id":"the group str id from the address bar"
#   "google_id":"user google id"
# }
@app.route('/api/remove', methods=['DELETE'])
@require_login
@require_group_str_id
def remove(user=None, group=None):
    """ If the user is the owner of the group
    remove all users from the group, delete users
    if they don't belong to any other group, and 
    then delete the group.
    If the user is just a member, remove the user
    from the group and try to delete the user. 
    """
    try:
        with handle_exceptions():
            if 'sid' not in session or 'namespace' not in session:
                raise ValueError("Missing session values")
            sid = session['sid']
            namespace = session['namespace']
            if group.owner.google_id == user.google_id:
                for g_user in group.users:
                    group.users.remove(g_user)
                    attempt_delete_user(g_user)
                db.session.delete(group)
                # Close socket-io room 
                close_room(group.group_str_id, sid=sid, namespace=namespace)
            else:
                group.users.remove(user)
                attempt_delete_user(user)
                # Leave socket-io room
                leave_room(group.group_str_id, sid=sid, namespace=namespace)
            db.session.commit()
            return "", 202
    except APIError as e:
        return e.response, e.code

# Example payload:
# headers:
# {
#   "google_id":"user google id"
# }
# {
# 	"access_token":"test_token",
# }
@app.route('/api/updateaccesstoken', methods=['PUT'])
@require_login
def update_access_token(user=None):
    try:
        with handle_exceptions():
            payload = request.json
            if payload is None:
                raise ValueError("Missing json body in post")
            user.access_token = payload['access_token']
            return "", 200
    except APIError as e:
        return e.response, e.code

# Catch all routes and host index
# So that we don't need browser router
# Has to be last route!
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """ Renders the actual react webpage.
    """
    return render_template('index.html')


if __name__ == '__main__':
    create_prod_app(app)
    # with app.app_context():
    #     db.drop_all()
    #     db.create_all()
    # app.run(port=5000, debug=True)
    sio.run(app, port=5000, debug=True)