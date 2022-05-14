from backend.server.utils.extensions import db
from backend.server.utils.BaseModel import BaseModel


class Video(BaseModel, db.Model):

    __tablename__ = 'videos'
    __table_args__ = (db.UniqueConstraint('site', 'siteId'), )
    
    id = db.Column(db.Integer, primary_key=True)
    
    name = db.Column(db.String(64))
    site = db.Column(db.String(64))
    siteId = db.Column(db.String(64))

    # Override to include product list
    def json(self):
        products = [p.json() for p in Product.query.filter(Product.videoId == self.id).all()]
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

    # TODO add checkout related fields
