import os
from uuid import uuid4
from flask import request, Blueprint, jsonify, make_response, send_from_directory, url_for, current_app
from backend.server.blueprints.main.models import Video, Product
from sqlalchemy import desc
from werkzeug.utils import secure_filename
from flask_cors import CORS

main = Blueprint('main', __name__, template_folder='templates')
CORS(main, origins=["http://localhost:3000","https://www.youtube.com/", "*"])

UPLOADS_ABSOLUTE_PATH = "/home/backend/server/static/uploads"

def productValid(data):
    
    if type(data) != dict:
        return False
    
    if "name" not in data or "timeEnter" not in data or "timeExit" not in data or "checkoutJson" not in data:
        return False
    
    return True

@main.route('/test', methods=['GET'])
def get_test():
    return make_response(jsonify({"Test": True}), 200)


@main.route('/fetch/video/<site>/<siteId>', methods=['GET'])
def getVideoBySite(site, siteId):

    try:
        video = Video.query.filter(Video.site == site.lower(), Video.siteId == siteId).first()
        if video is not None:
            resp = make_response(jsonify({"Data": video.json(True)}), 200)
            resp.headers['Access-Control-Allow-Origin'] = '*'
            resp.headers['Content-Type'] = 'application/json'
            return resp

    except:
        return make_response(jsonify({"Error": "Error during fetch"}), 500)

    return make_response(jsonify({"Error": "Unknown Video"}), 400)

@main.route('/fetch/videos', methods=['GET'])
def getVideos():

    try:
        videos = Video.query.order_by(desc(Video.created_on)).all()
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
def createProductBySite(site, siteId):

    data = request.get_json()

    try:
        video = Video.query.filter(Video.site == site.lower(), Video.siteId == siteId).first()

        if video is not None and productValid(data):
            data["videoId"] = video.id
            product = Product(**data).save()
            return make_response(jsonify({"Data": product.json(False)}), 200)

    except:
        return make_response(jsonify({"Error": "Error during save attempt"}), 500)

    return make_response(jsonify({"Error": "Incomplete or invalid request"}), 400)

@main.route('/create/product/<videoId>', methods=['POST'])
def createProduct(videoId):
    
    data = request.get_json()
    
    try:
        video = Video.query.filter(Video.id == int(videoId)).first()
        
        if video is not None and productValid(data):
            data["videoId"] = video.id
            product = Product(**data).save()
            return make_response(jsonify({"Data": product.json(False)}), 200)

    except:
        return make_response(jsonify({"Error": "Error during save attempt"}), 500)

    return make_response(jsonify({"Error": "Incomplete or invalid request"}), 400)

@main.route('/delete/video/<videoId>')
def deleteVideo(videoId):
    try:
        video = Video.query.filter(Video.id == int(videoId)).first()
        if video is not None:
            video.delete()
            return make_response(jsonify({"Deleted": True}), 200)
    except:
        return make_response(jsonify({"Error": "Error during delete attempt"}), 500)

    return make_response(jsonify({"Error": "Incomplete or invalid request"}), 400)

@main.route('/delete/product/<productId>')
def deleteProduct(productId):
    try:
        product = Product.query.filter(Product.id == int(productId)).first()
        if product is not None:
            product.delete()
            return make_response(jsonify({"Deleted": True}), 200)
    except:
        return make_response(jsonify({"Error": "Error during delete attempt"}), 500)

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