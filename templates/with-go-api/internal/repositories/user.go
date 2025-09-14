package repositories

import (
	"context"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"golang.org/x/crypto/bcrypt"
	"time"
	"with-go-api/internal/models"
)

type UserRepo struct {
	Collection *mongo.Collection
}

func User() *UserRepo {
	return &UserRepo{
		Collection: MongoDatabase.Collection("users"),
	}
}

func (r *UserRepo) FindByQuery(query models.UserQuery) ([]models.User, *models.Pagination, error) {
	filter := query.Filter
	opts := query.ParseQueryOptions()

	if !query.ShowPassword {
		opts.SetProjection(bson.M{"password": 0})
	}

	var pagination *models.Pagination
	if query.WithPagination {
		count, err := r.Collection.CountDocuments(context.Background(), filter)
		if err != nil {
			pagination.Total = int(count)
		}
		pagination.Page = query.Page
		pagination.Limit = query.Limit
	}

	cursor, err := r.Collection.Find(context.TODO(), filter, opts)
	if err != nil {
		return nil, pagination, err
	}

	var results []models.User
	if err := cursor.All(context.Background(), &results); err != nil {
		return nil, pagination, err
	}

	return results, pagination, err
}

func (r *UserRepo) FindOneByQuery(filter bson.M, showPassword bool) (*models.User, error) {
	opts := options.FindOne()

	if !showPassword {
		opts.SetProjection(bson.M{"password": -1})
	}

	var user models.User
	err := r.Collection.FindOne(context.Background(), filter, opts).Decode(&user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepo) Create(request models.User) (*models.User, error) {
	request.ID = uuid.New().String()
	request.CreatedAt = time.Now()
	request.UpdatedAt = time.Now()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	request.Password = string(hashedPassword)

	_, err = r.Collection.InsertOne(context.Background(), request)
	if err != nil {
		return nil, err
	}

	user, err := r.FindOneByQuery(bson.M{"id": request.ID}, false)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *UserRepo) Update(request models.User) (*models.User, error) {
	_, err := r.Collection.UpdateOne(context.Background(), bson.M{"id": request.ID}, request)
	if err != nil {
		return nil, err
	}

	user, err := r.FindOneByQuery(bson.M{"id": request.ID}, false)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *UserRepo) Delete(id string) error {
	_, err := r.Collection.DeleteOne(context.Background(), bson.M{"id": id})
	if err != nil {
		return err
	}

	return nil
}
