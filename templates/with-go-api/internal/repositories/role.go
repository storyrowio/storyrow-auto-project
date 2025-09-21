package repositories

import (
	"context"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"time"
	"with-go-api/internal/models"
)

type RoleRepo struct {
	Collection *mongo.Collection
}

func Role() *RoleRepo {
	return &RoleRepo{
		Collection: MongoDatabase.Collection("roles"),
	}
}

func (r *RoleRepo) FindAll() ([]models.Role, error) {
	cursor, err := r.Collection.Find(context.TODO(), bson.M{}, nil)
	if err != nil {
		return nil, err
	}

	var results []models.Role
	if err := cursor.All(context.Background(), &results); err != nil {
		return nil, err
	}

	return results, err
}

func (r *RoleRepo) FindOneByQuery(filter bson.M, opts *options.FindOneOptionsBuilder) (*models.Role, error) {
	var data models.Role

	err := r.Collection.FindOne(context.Background(), filter, opts).Decode(&data)
	if err != nil {
		return nil, err
	}

	return &data, nil
}

func (r *RoleRepo) Create(request models.Role) (*models.Role, error) {
	request.ID = uuid.New().String()
	request.CreatedAt = time.Now()
	request.UpdatedAt = time.Now()

	_, err := r.Collection.InsertOne(context.Background(), request)
	if err != nil {
		return nil, err
	}

	result, err := r.FindOneByQuery(bson.M{"id": request.ID}, nil)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (r *RoleRepo) Update(request models.Role) (*models.Role, error) {
	_, err := r.Collection.UpdateOne(context.Background(), bson.M{"id": request.ID}, request)
	if err != nil {
		return nil, err
	}

	result, err := r.FindOneByQuery(bson.M{"id": request.ID}, nil)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (r *RoleRepo) Delete(id string) error {
	_, err := r.Collection.DeleteOne(context.Background(), bson.M{"id": id})
	if err != nil {
		return err
	}

	return nil
}
