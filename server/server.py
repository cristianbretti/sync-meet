import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView


db_path = os.path.join(os.path.dirname(__file__), '../db/syncmeet.db')
db_uri = 'sqlite:///{}'.format(db_path)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SECRET_KEY'] = 'mysecret' #TODO: import from config file

db = SQLAlchemy(app)
admin = Admin(app)

class user(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    auth_token = db.Column(db.String(30))

admin.add_view(ModelView(user, db.session))

class group_association(db.Model):
    __tablename__ = "group_association"
    planning_group_id = db.Column(db.Integer, db.ForeignKey('planning_group.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    user = db.relationship('user')

admin.add_view(ModelView(group_association, db.session))

class planning_group(db.Model):
    __tablename__ = "planning_group"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    from_date = db.Date()
    to_date = db.Date()
    from_time = db.Time()
    to_time = db.Time()
    meeting_length = db.Time()
    users = db.relationship('group_association')

admin.add_view(ModelView(planning_group, db.session))


if __name__ == '__main__':
    app.run(port=5000, debug=True)