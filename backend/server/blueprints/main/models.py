from backend.server.utils.extensions import db
from backend.server.utils.BaseModel import BaseModel


class Video(BaseModel, db.Model):

    __tablename__ = 'videos'
    
    id = db.Column(db.Integer, primary_key=True)
    
    name = db.Column(db.String(64))
    site = db.Column(db.String(64))
    siteId = db.Column(db.String(64))

    # TODO add checkout related fields
