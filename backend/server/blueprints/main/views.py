import os
from uuid import uuid4
from flask import request, Blueprint, jsonify, make_response, send_from_directory, url_for, current_app
from backend.server.blueprints.main.models import Video, Product
from werkzeug.utils import secure_filename
from flask_cors import CORS

main = Blueprint('main', __name__, template_folder='templates')
CORS(main, origins=["http://localhost:3000","https://www.youtube.com/", "*"])

UPLOADS_ABSOLUTE_PATH = "/home/backend/server/static/uploads"

@main.route('/test', methods=['GET'])
def get_test():
    return make_response(jsonify({"Test": True}), 200)


@main.route('/fetch/video/<site>/<siteId>', methods=['GET'])
def getVideoBySite(site, siteId):

    try:
        video = Video.query.filter(Video.site == site.lower(), Video.siteId == siteId).first()
        if video is not None:
            resp = make_response(jsonify({"Data": video.json(True)}), 200)
            # TODO make a wrapper so that these headers are on every resonse
            resp.headers['Access-Control-Allow-Origin'] = '*'
            resp.headers['Content-Type'] = 'application/json'
            print(resp.headers)
            return resp

    except:
        return make_response(jsonify({"Error": "Error during fetch"}), 500)

    return make_response(jsonify({"Error": "Unknown Video"}), 400)

@main.route('/fetch/videos', methods=['GET'])
def getVideos():

    try:
        videos = Video.query.all()
        if videos is not None and videos != []:
            resp = make_response(jsonify({"Data": [v.json(False) for v in videos]}), 200)
            return resp

    except:
        return make_response(jsonify({"Error": "Error during fetch"}), 500)

    return make_response(jsonify({"Error": "Unknown Video"}), 400)

@main.route('/create/video', methods=['POST'])
def createVideo():

    try:
        print(request.get_json(), request.get_data())

        data = request.get_json()
        if data.get('name') is not None and data.get('site') is not None and data.get('siteId') is not None:
            video = Video(**data).save()
            return make_response(jsonify({"Data": video.json(False)}), 200)

    except:
        return make_response(jsonify({"Error": "Error during save attempt"}), 500)

    return make_response(jsonify({"Error": "Incomplete or invalid request"}), 400)


@main.route('/create/product/<site>/<siteId>', methods=['POST'])
def createProduct(site, siteId):

    try:
        video = Video.query.filter(Video.site == site.lower(), Video.siteId == siteId).first()
        data = request.get_json()
        # TODO validate response has required product fields

        if video is not None and data is not None:
            data["videoId"] = video.id
            product = Product(**data).save()
            return make_response(jsonify({"Data": product.json(False)}), 200)

    except:
        return make_response(jsonify({"Error": "Error during save attempt"}), 500)

    return make_response(jsonify({"Error": "Incomplete or invalid request"}), 400)


@main.route('/upload', methods=['POST'])
def upload():

    uploaded_file = request.files['file']
    filename = uploaded_file.filename
    
    if filename != '':
        ext = os.path.splitext(filename)[1]

        if ext not in [".jpg", ".jpeg", ".png"]:
            make_response(jsonify({"Error": "File extension not allowed"}), 400)

        generated_filename = str(uuid4()) + ext
        uploaded_file.save(os.path.join(UPLOADS_ABSOLUTE_PATH, generated_filename))

    return make_response(jsonify({"filename":generated_filename}))

@main.route('/uploads/<filename>', methods=['GET'])
def readUpload(filename):
    return send_from_directory('static/uploads', filename)