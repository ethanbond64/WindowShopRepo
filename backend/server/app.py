from flask import Flask
from backend.server.utils.extensions import db
from backend.server.blueprints.main import main

def create_app():
    app = Flask(__name__)

    app.config.from_pyfile('utils/settings.py', silent=True)
    db.init_app(app)
    # uncomment this for first run
    # db.drop_all(app=app)
    db.create_all(app=app)
    app.register_blueprint(main)

    return app


