from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
db_path = os.path.join(os.path.dirname(__file__), '../db/syncmeet.db')
db_uri = 'sqlite:///{}'.format(db_path)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))


if __name__ == '__main__':
    app.run(host=5000, debug=True)