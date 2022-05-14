from datetime import datetime
from backend.server.utils.extensions import db
from backend.server.utils.BaseModel import BaseModel
# from sqlalchemy.dialects.postgresql import JSON


class Video(BaseModel, db.Model):

    __tablename__ = 'videos'
    
    id = db.Column(db.Integer, primary_key=True)
    
    name = db.Column(db.String(64))
    site = db.Column(db.String(64))
    siteId = db.Column(db.String(64))

    # TODO add checkout related fields
