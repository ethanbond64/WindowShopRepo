import os
from datetime import timedelta

DEBUG=True
SECRET_KEY='temp'
REMEMBER_COOKIE_DURATION=timedelta(days=90)
SERVER_NAME=os.getenv('SERVER_NAME')
SQLALCHEMY_DATABASE_URI = os.getenv('DB_URI')
SQLALCHEMY_TRACK_MODIFICATIONS = False
