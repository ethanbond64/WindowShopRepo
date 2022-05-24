from email import header
import hashlib
import base64
import json
import requests
from datetime import datetime
import calendar
import string
from random import *
import hmac
from dotenv import load_dotenv
import os

load_dotenv()

# TODO watch these commented out variables
http_method = 'post'                   # get|put|post|delete - must be lowercase
# http_method = 'get'                   # get|put|post|delete - must be lowercase
base_url = 'https://sandboxapi.rapyd.net'
path = '/v1/checkout'           # Portion after the base URL. Hardkeyed for this example.
# path = '/v1/data/countries'   

# salt: randomly generated for each request.
min_char = 8
max_char = 12
allchar = string.ascii_letters + string.punctuation + string.digits
salt = "".join(choice(allchar)for x in range(randint(min_char, max_char)))

# Current Unix time (seconds).
d = datetime.utcnow()
timestamp = calendar.timegm(d.utctimetuple())

access_key = os.getenv('RAPYD_KEY')        # The access key received from Rapyd.
secret_key = os.getenv('RAPYD_SECRET')        # Never transmit the secret key by itself.

body = {"amount":100,"country":"US","currency":"USD"}                             # JSON body goes here. Always empty string for GET; 
                                      # strip nonfunctional whitespace.

if http_method == 'get':
    body_to_sign = '' 
else:
    body_to_sign = json.dumps(body).replace(' ','')

print(body_to_sign)
to_sign = http_method + path + salt + str(timestamp) + access_key + secret_key + body_to_sign

h = hmac.new(bytes(secret_key, 'utf-8'), bytes(to_sign, 'utf-8'), hashlib.sha256)

signature = base64.urlsafe_b64encode(str.encode(h.hexdigest()))

url = base_url + path

headers = {
    'access_key': access_key,
    'signature': signature,
    'salt': salt,
    'timestamp': str(timestamp),
    'Content-Type': "application\/json"
}

print(headers)

if http_method == 'post':
    x = requests.post(url, data = body_to_sign, headers = headers)
else:
    x = requests.get(url, headers = headers)

print(x)
print(x.text)