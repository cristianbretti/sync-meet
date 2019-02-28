
from flask import Flask, render_template, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
import os
import json
from datetime import datetime
from contextlib import contextmanager
from functools import wraps

# File paths
root_path = os.path.realpath(os.path.join(os.path.abspath(os.path.dirname(__file__)), '..'))
db_path = os.path.join(root_path, 'db', 'syncmeet.db')
db_uri = 'sqlite:///{}'.format(db_path)
static_folder_path = os.path.join(root_path, 'client', 'build', 'static')
template_folder_path = os.path.join(root_path, 'client', 'build')

app = Flask(__name__, static_folder=static_folder_path, template_folder=template_folder_path)
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SECRET_KEY'] = 'mysecret' #TODO: import from config file

db = SQLAlchemy(app)
admin = Admin(app)

# dev only
from flask_cors import CORS, cross_origin
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
#

""" DATABASE MODEL """
class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    auth_token = db.Column(db.String(30))

    def __init__(self, name, auth_token):
        self.name = name
        self.auth_token = auth_token

    def __repr__(self):
        return '<User %d %r>' % (self.id, self.name)

admin.add_view(ModelView(User, db.session))

association_table = db.Table( 'group_association', db.metadata,
    db.Column('planning_group_id', db.Integer, db.ForeignKey('planning_group.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
    )

class Planning_group(db.Model):
    __tablename__ = "planning_group"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    from_date = db.Column(db.Date())
    to_date = db.Column(db.Date())
    from_time = db.Column(db.Time())
    to_time = db.Column(db.Time())
    meeting_length = db.Column(db.Time())
    users = db.relationship('User', secondary=association_table, backref=db.backref('planning_group', lazy='joined'))

    def __init__(self, name, from_date, to_date, from_time, to_time, meeting_length):
        self.name = name
        self.from_date = from_date
        self.to_date = to_date
        self.from_time = from_time
        self.to_time = to_time
        self.meeting_length = meeting_length

    def __repr__(self):
        return '<Group %d %r>' % (self.id, self.name)

admin.add_view(ModelView(Planning_group, db.session))

""" HELPERS """
class APIError(Exception):
    def __init__(self, response, code):
        super(APIError, self).__init__()
        self.response = response
        self.code = code

@contextmanager
def handle_exceptions():
    try:
        yield
    except ValueError as e:
        raise APIError(jsonify({'error': str(e)}), 400)
    except KeyError as e:
        raise APIError(jsonify({'error': "Missing parameter: " + str(e)}), 400)
    except:
        raise APIError(jsonify({'error': "Internal server error"}), 500)

def attempt_delete_user(user):
    if len(user.planning_group) == 0:
        db.session.delete(user)

def require_api_token(func):
    @wraps(func) 
    def check_api_token(*args, **kwargs):
        if 'api_session_token' not in session:
            return jsonify({'error': "Access denied"}), 403
        return func(*args, **kwargs)
    return check_api_token



""" API ENDPOINTS """
# Example payload:
# {
# 	"name":"test_user",
# 	"auth_token":"test_token"
# }
@app.route('/api/createuser', methods=['POST'])
@cross_origin() #dev only
def create_user():
    try:
        with handle_exceptions():
            payload = request.json
            name = payload['name']
            auth_token = payload['auth_token']
            if len(name) > 30:
                raise ValueError("Name too long. Max 30 characters")
            #TODO: input check auth token https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=accessToken
            new_user = User(name, auth_token)
            db.session.add(new_user)
            db.session.commit()
            return (jsonify({'user_id': new_user.id}), 201)
    except APIError as e:
        return e.response, e.code

# Example payload
# {
# 	"name":"test_group",
# 	"from_date":"2019-02-20",
# 	"to_date":"2019-02-21",
# 	"from_time":"10:00",
# 	"to_time":"18:00",
# 	"meeting_length":"01:00"
# }
@app.route('/api/creategroup', methods=['POST'])
@cross_origin() #dev only
def create_group():
    try:
        with handle_exceptions():
            payload = request.json
            name = payload['name']
            if len(name) > 30:
                raise ValueError("Name too long. Max 30 characters")
            new_group = Planning_group(
                name,
                datetime.strptime(payload['from_date'], '%Y-%m-%d').date(),
                datetime.strptime(payload['to_date'], '%Y-%m-%d').date(),
                datetime.strptime(payload['from_time'], '%H:%M').time(),
                datetime.strptime(payload['to_time'], '%H:%M').time(),
                datetime.strptime(payload['meeting_length'], '%H:%M').time(),
            )
            db.session.add(new_group)
            db.session.commit()
            return (jsonify({'group_id': new_group.id}), 201)
    except APIError as e:
        return e.response, e.code

# Example payload
# {
# 	"user_id":2,
# 	"group_id":3,
# 	"command":"remove" | "add"
# }
@app.route('/api/updategroupusers', methods=['PUT'])
@cross_origin() # dev only
def add_user_to_group():
    try:
        with handle_exceptions():
            payload = request.json
            user = User.query.filter_by(id= payload['user_id']).first()
            if user is None:
                raise ValueError("User not found")
            group = Planning_group.query.filter_by(id= payload['group_id']).first()
            if group is None:
                raise ValueError("Group not found")
            if payload['command'] == 'add':
                group.users.append(user)
            elif payload['command'] == 'remove':
                group.users.remove(user)
                attempt_delete_user(user)
            else:
                raise ValueError("Unknown command")
            db.session.commit()
            return jsonify({'group_id': group.id}), 200
    except APIError as e:
        return e.response, e.code

@app.route('/api/getusersfromgroup')
@cross_origin() # dev only
def get_users_from_group():
    try:
        with handle_exceptions():
            group_id = request.args['group_id']
            group = Planning_group.query.filter_by(id=group_id).first()
            if group is None:
                raise ValueError("Group not found")
            users = [user.name for user in group.users]
            return jsonify({'users': users})
    except APIError as e:
        return e.response, e.code

@app.route('/api/deletegroup', methods=['DELETE'])
@cross_origin() # dev only
def delete_group():
    try:
        with handle_exceptions():
            group_id = request.args['group_id']
            group = Planning_group.query.filter_by(id=group_id).first()
            if group is None:
                raise ValueError("Group not found")
            for user in group.users:
                group.users.remove(user)
                attempt_delete_user(user)
            db.session.delete(group)
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