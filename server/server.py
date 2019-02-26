import os
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
import json
from datetime import datetime



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

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    auth_token = db.Column(db.String(30))

    def __init__(self, name, auth_token):
        self.name = name
        self.auth_token = auth_token

    def __repr__(self):
        return '<User %d%r>' % (self.id, self.name)

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
    users = db.relationship('User', secondary=association_table)

    def __init__(self, name, from_date, to_date, from_time, to_time, meeting_length):
        self.name = name
        self.from_date = from_date
        self.to_date = to_date
        self.from_time = from_time
        self.to_time = to_time
        self.meeting_length = meeting_length

    def __repr__(self):
        return '<Group %d%r>' % (self.id, self.name)

admin.add_view(ModelView(Planning_group, db.session))

#TODO: Add try catches to all API routes

@app.route('/api/createuser', methods=['POST'])
@cross_origin() #dev only
def create_user():
    payload = request.json
    new_user = User(payload['name'], payload['auth_token'])
    db.session.add(new_user)
    db.session.commit()
    return (jsonify({'id': new_user.id}), 201)


@app.route('/api/creategroup', methods=['POST'])
@cross_origin() #dev only
def create_group():
    payload = request.json
    new_group = Planning_group(
        payload['name'],
        datetime.strptime(payload['from_date'], '%Y-%m-%d').date(),
        datetime.strptime(payload['to_date'], '%Y-%m-%d').date(),
        datetime.strptime(payload['from_time'], '%H:%M').time(),
        datetime.strptime(payload['to_time'], '%H:%M').time(),
        datetime.strptime(payload['meeting_length'], '%H:%M').time(),
        )
    db.session.add(new_group)
    db.session.commit()
    return (jsonify({'id': new_group.id}), 201)

@app.route('/api/addusertogroup', methods=['POST'])
@cross_origin() # dev only
def add_user_to_group():
    try:
        payload = request.json
        user = User.query.filter_by(id= payload['user_id']).first()
        if user is None:
            raise ValueError("User not found")
        group = Planning_group.query.filter_by(id= payload['group_id']).first()
        if group is None:
            raise ValueError("Group not found")
        group.users.append(user)
        db.session.commit()
        return "", 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except:
        return jsonify({'error': "Internal server error"}), 500

# Catch all routes and host index
# So that we don't need browser router
# Has to be last route!
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@cross_origin() #dev only
def index(path):
    return render_template('index.html')

if __name__ == '__main__':
    app.run(port=5000, debug=True)