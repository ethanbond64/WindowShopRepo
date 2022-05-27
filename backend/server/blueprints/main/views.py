import os
from flask import request, Blueprint, jsonify, make_response, send_from_directory, url_for, current_app
from backend.server.blueprints.main.models import Video, Product
# from werkzeug.utils import secure_filename
from flask_cors import CORS

main = Blueprint('main', __name__, template_folder='templates')
# CORS(main, origins=["http://localhost:3000","https://www.youtube.com/"])


@main.route('/test', methods=['GET'])
def get_test():
    return make_response(jsonify({"Test": True}), 200)


@main.route('/fetch/video/<site>/<siteId>', methods=['GET'])
def getVideoBySite(site, siteId):

    try:
        video = Video.query.filter(Video.site == site.lower(), Video.siteId == siteId).first()
        if video is not None:
            resp = make_response(jsonify({"Data": video.json()}), 200)
            # TODO make a wrapper so that these headers are on every resonse
            resp.headers['Access-Control-Allow-Origin'] = '*'
            resp.headers['Content-Type'] = 'application/json'
            print(resp.headers)
            return resp

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


@main.route('/create/product/<site>/<siteId>', methods=['POST'])
def createProduct(site, siteId):

    try:
        video = Video.query.filter(Video.site == site.lower(), Video.siteId == siteId).first()
        data = request.get_json()
        # TODO validate response has required product fields

        if video is not None and data is not None:
            data["videoId"] = video.id
            product = Product(**data).save()
            return make_response(jsonify({"Data": product.json()}), 200)

    except:
        return make_response(jsonify({"Error": "Error during save attempt"}), 500)

    return make_response(jsonify({"Error": "Incomplete or invalid request"}), 400)


# @main.route('/upload', methods-['POST'])
# def upload():
#     uploaded_file = request.files['file']
#     filename = secure_filename(uploaded_file.filename)
#     print(filename)
#     if filename != '':
#         file_ext = os.path.splitext(filename)[1]
#         if file_ext not in current_app.config['UPLOAD_EXTENSIONS']:# or file_ext != validate_image(uploaded_file.stream):
#             make_response(jsonify({"Error": ""}), 400)
#         uploaded_file.save(os.path.join(current_app.config['UPLOAD_PATH'], filename))
#     return make_response(jsonify({"filename":filename}))

@main.route('/uploads/<filename>', methods=['GET'])
def readUpload(filename):
    return send_from_directory('static/uploads', filename)