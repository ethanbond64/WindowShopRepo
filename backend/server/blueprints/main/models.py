import os
from flask import url_for
from requests import request
from backend.server.blueprints.main.rapydUtils import getCheckoutId
from backend.server.utils.extensions import db
from backend.server.utils.BaseModel import BaseModel
from sqlalchemy.dialects.postgresql import JSON

WEB_PREFIX = "http://"
SERVER_NAME = os.getenv("SERVER_NAME")
UPLOAD_DIR = "/uploads/"

class Video(BaseModel, db.Model):

    __tablename__ = 'videos'
    __table_args__ = (db.UniqueConstraint('site', 'siteId'), )
    
    id = db.Column(db.Integer, primary_key=True)
    
    name = db.Column(db.String(64))
    site = db.Column(db.String(64))
    siteId = db.Column(db.String(64))
    thumbnail = db.Column(db.String(256))

    # Override to include product list
    def json(self, checkingOut):
        products = [p.json(checkingOut) for p in Product.query.filter(Product.videoId == self.id).all()]
        data = super().json()
        data["products"] = products
        return data


class Product(BaseModel, db.Model):

    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    videoId = db.Column(db.Integer, db.ForeignKey("videos.id"), index=True, nullable=False)

    name = db.Column(db.String(64))

    # Time in seconds when the product first arrives on screen
    timeEnter = db.Column(db.Integer)

    # Time in seconds when the product first leaves the screen
    timeExit = db.Column(db.Integer)

    # Rapyd checkout id used when we go to embed
    checkoutId = db.Column(db.String(64))
    checkoutJson = db.Column(JSON)

    # Product Image URL
    imgUrl = db.Column(db.String(256))
    
    def json(self, checkingOut):
        data = super().json()
        
        # Populate checkoutId with brand new authenticated id 
        if checkingOut:
            data["checkoutId"] = getCheckoutId(data['checkoutJson'])
            
        data["imgUrl"] = WEB_PREFIX + SERVER_NAME + UPLOAD_DIR + data["imgUrl"]
        return data