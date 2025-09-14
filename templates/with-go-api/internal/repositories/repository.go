package repositories

import "go.mongodb.org/mongo-driver/v2/mongo"

var MongoDatabase *mongo.Database

func Init(database *mongo.Database) {
	MongoDatabase = database
}
