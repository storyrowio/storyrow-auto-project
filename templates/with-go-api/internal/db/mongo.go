package db

import (
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"with-go-api/internal/config"
)

func Connect(cfg *config.Config) (*mongo.Client, *mongo.Database) {
	client, err := mongo.Connect(options.Client().
		ApplyURI(cfg.DatabaseUri))
	if err != nil {
		panic(err)
	}
	//defer func() {
	//	if err := client.Disconnect(context.TODO()); err != nil {
	//		panic(err)
	//	}
	//}()

	db := client.Database(cfg.DatabaseName)
	return client, db
}
