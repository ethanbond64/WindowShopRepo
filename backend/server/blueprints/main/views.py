from flask import request, Blueprint, jsonify, make_response
from backend.server.blueprints.main.models import Video
from flask_cors import CORS

main = Blueprint('main', __name__, template_folder='templates')
CORS(main, origins="http://localhost:3000")


@main.route('/test', methods=['GET'])
def get_test():
    return make_response(jsonify({"Test": True}), 200)


@main.route('/fetch/video/<site>/<siteId>', methods=['GET'])
def getVideoBySite(site, siteId):

    try:
        video = Video.query.filter(Video.site == site.lower(), Video.siteId == siteId).first()
        if video is not None:
            return make_response(jsonify({"Data": video.json()}), 200)

    except:
        return make_response(jsonify({"Error": "Error during fetch"}), 500)

    return make_response(jsonify({"Error": "Unknown Video"}), 400)


@main.route('/create/video', methods=['POST'])
def createVideo():

    try:
        data = request.get_json()

        if data.get('name') is not None and data.get('site') is not None and data.get('siteId') is not None:
            video = Video(**data).save()
            return make_response(jsonify({"Data": video.json()}), 200)

    except:
        return make_response(jsonify({"Error": "Error during save attempt"}), 500)

    return make_response(jsonify({"Error": "Incomplete or invalid request"}), 400)
