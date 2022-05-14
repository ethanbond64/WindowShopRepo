from flask import request, Blueprint, jsonify, make_response
from backend.server.blueprints.main.models import Video
from flask_cors import CORS


main = Blueprint('main', __name__,template_folder='templates')
CORS(main,origins="http://localhost:3000")

# GET ENDPOINTS
@main.route('/test',methods=['GET'])
def get_test():
    return make_response(jsonify({"Test":True}),200)
