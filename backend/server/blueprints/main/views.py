from flask import request, Blueprint, jsonify, make_response
from backend.server.blueprints.main.models import Video, Product
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

    print(request.get_json())
    try:
        data = request.get_json()

        print(data)
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
