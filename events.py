from pymongo import MongoClient

client = MongoClient()
events = client.db.events
