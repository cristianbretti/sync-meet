from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

db = SQLAlchemy()
admin = Admin()

""" DATABASE MODEL """
class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(30), unique=True)
    name = db.Column(db.String(30))
    access_token = db.Column(db.String(30))

    def __init__(self, google_id, name, access_token):
        self.google_id = google_id
        self.name = name
        self.access_token = access_token

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
    group_str_id = db.Column(db.String(16), unique=True)
    name = db.Column(db.String(30))
    from_date = db.Column(db.Date())
    to_date = db.Column(db.Date())
    from_time = db.Column(db.Time())
    to_time = db.Column(db.Time())
    meeting_length = db.Column(db.Time())
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    owner = db.relationship('User', backref=db.backref('owner'))
    users = db.relationship('User', secondary=association_table, backref=db.backref('planning_group', lazy='joined'))

    def __init__(self, group_str_id, name, from_date, to_date, from_time, to_time, meeting_length, owner):
        self.group_str_id = group_str_id
        self.name = name
        self.from_date = from_date
        self.to_date = to_date
        self.from_time = from_time
        self.to_time = to_time
        self.meeting_length = meeting_length
        self.owner = owner

    def __repr__(self):
        return '<Group %d %r>' % (self.id, self.name)

admin.add_view(ModelView(Planning_group, db.session))