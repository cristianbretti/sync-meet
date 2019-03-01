from flask import Flask, render_template, request, jsonify, session
from model import db, admin, User, Planning_group
import config
from helpers import *
import os
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
app.config['SECRET_KEY'] = config.MY_SECRET


db.init_app(app)
admin.init_app(app)

""" dev only """
from flask_cors import CORS, cross_origin
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
""" end """

""" API ENDPOINTS """
# Example payload
# {
# 	"group_name":"test_group",
# 	"from_date":"2019-02-20",
# 	"to_date":"2019-02-21",
# 	"from_time":"10:00",
# 	"to_time":"18:00",
# 	"meeting_length":"01:00",
#   "user_name":"test_user",
# 	"access_token":"test_token",
#   "id_token":"googles long token id in response.getAuthResponse().id_token"
# }
@app.route('/api/creategroup', methods=['POST'])
@cross_origin() #dev only
def create_group():
    try:
        with handle_exceptions():
            payload = request.json
            # get group params
            group_name = payload['group_name']
            from_date = datetime.strptime(payload['from_date'], '%Y-%m-%d').date()
            to_date = datetime.strptime(payload['to_date'], '%Y-%m-%d').date()
            from_time = datetime.strptime(payload['from_time'], '%H:%M').time()
            to_time = datetime.strptime(payload['to_time'], '%H:%M').time()
            meeting_length = datetime.strptime(payload['meeting_length'], '%H:%M').time()
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
            return jsonify({
                'group_str_id': new_group.group_str_id,
                'user_google_id': user.google_id
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
@cross_origin() #dev only
@require_group_str_id
def add_user(group=None):
    try:
        with handle_exceptions():
            payload = request.json
            name = payload['name']
            id_token = payload['id_token']
            access_token = payload['access_token']
            user = create_or_find_user(id_token, name, access_token)
            group.users.append(user)
            db.session.commit()
            return jsonify({'user_google_id': user.google_id}), 200
    except APIError as e:
        return e.response, e.code

# Example payload
# headers:
# {
#   "group_str_id":"the group str id from the address bar"
#   "google_id":"user google id"
# }
@app.route('/api/getusersfromgroup')
@cross_origin() # dev only
@require_login
@require_group_str_id
def get_users_from_group(group=None):
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
@cross_origin() # dev only
@require_login
@require_group_str_id
def get_group_calendar(group=None):
    try:
        with handle_exceptions():
            calendars = [get_calendar(user.access_token) for user in group.users]
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
@cross_origin() # dev only
@require_login
@require_group_str_id
def remove(group=None):
    try:
        with handle_exceptions():
            if group.owner.google_id == session['google_id']:
                for user in group.users:
                    group.users.remove(user)
                    attempt_delete_user(user)
                db.session.delete(group)
            else:
                user = User.query.filter_by(google_id=session['google_id']).first()
                group.users.remove(user)
                attempt_delete_user(user)
            db.session.commit()
            return "", 202
    except APIError as e:
        return e.response, e.code

# Catch all routes and host index
# So that we don't need browser router
# Has to be last route!
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@cross_origin() #dev only
def index(path):
    # session.permanent = True
    return render_template('index.html')

if __name__ == '__main__':
    app.run(port=5000, debug=True)