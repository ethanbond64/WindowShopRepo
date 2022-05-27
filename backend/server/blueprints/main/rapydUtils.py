import hashlib
import base64
import json
import requests
from datetime import datetime
import calendar
import string
from random import *
import hmac
import os

# Keys
KEY = os.getenv('RAPYD_KEY')
SECRET = os.getenv('RAPYD_SECRET')

METHOD = 'post'
BASE_URL = 'https://sandboxapi.rapyd.net'
PATH = '/v1/checkout'
ENCODING = 'utf-8'

MIN = 8
MAX = 12


def getCheckoutId(body):
    allchar = string.ascii_letters + string.punctuation + string.digits
    salt = "".join(choice(allchar)for x in range(randint(MIN, MAX)))

    # Current Unix time (seconds).
    d = datetime.utcnow()
    timestamp = calendar.timegm(d.utctimetuple())

    body_to_sign = json.dumps(body).replace(' ','')

    to_sign = METHOD + PATH + salt + str(timestamp) + KEY + SECRET + body_to_sign

    h = hmac.new(bytes(SECRET, ENCODING), bytes(to_sign, ENCODING), hashlib.sha256)

    signature = base64.urlsafe_b64encode(str.encode(h.hexdigest()))

    headers = {
        'access_key': KEY,
        'signature': signature,
        'salt': salt,
        'timestamp': str(timestamp),
        'Content-Type': "application\/json"
    }

    resp = requests.post(BASE_URL + PATH, data = body_to_sign, headers = headers)

    return resp.json().get('data').get('id')