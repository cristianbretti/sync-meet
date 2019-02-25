import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), '../db/syncmeet.db')
db_uri = 'sqlite:///{}'.format(db_path)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SECRET_KEY'] = 'mysecret' #TODO: import from config file

db = SQLAlchemy(app)
admin = Admin(app)

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    auth_token = db.Column(db.String(30))

admin.add_view(ModelView(User, db.session))

association_table = db.Table( 'group_association', db.metadata,
    db.Column('planning_group_id', db.Integer, db.ForeignKey('planning_group.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
    )
# association_table.__name__ = 'group_association'

# admin.add_view(ModelView(association_table, db.session))

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

admin.add_view(ModelView(Planning_group, db.session))


if __name__ == '__main__':
    app.run(port=5000, debug=True)