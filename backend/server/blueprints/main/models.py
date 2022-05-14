from backend.server.utils.extensions import db
from backend.server.utils.BaseModel import BaseModel


class Video(BaseModel, db.Model):

    __tablename__ = 'videos'
    
    id = db.Column(db.Integer, primary_key=True)
    
    name = db.Column(db.String(64))
    site = db.Column(db.String(64))
    siteId = db.Column(db.String(64))


class Product(BaseModel, db.Model):

    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    videoId = db.Column(db.Integer, db.ForeignKey("videos.id"), index=True, nullable=False)

    name = db.Column(db.String(64))

    # Time in seconds when the product first arrives on screen
    timeEnter = db.Column(db.Integer)

    # Time in seconds when the product first leaves the screen
    timeExit = db.Column(db.Integer)

    # TODO add checkout related fields
