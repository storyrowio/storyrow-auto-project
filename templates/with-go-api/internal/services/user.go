package services

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"with-go-api/internal/models"
	"with-go-api/internal/repositories"
)

type UserService struct{}

func User() *UserService {
	return &UserService{}
}

func (s *UserService) FindByQuery(query models.UserQuery) ([]models.User, *models.Pagination, error) {
	results, pagination, err := repositories.User().FindByQuery(query)

	roleIds := make([]string, 0)
	for _, result := range results {
		roleIds = append(roleIds, result.RoleId)
	}

	newResults := make([]models.User, 0)

	roles, _ := repositories.Role().FindAll()
	for _, item := range results {
		for _, role := range roles {
			if role.ID == item.RoleId {
				item.Role = role
			}
		}

		newResults = append(newResults, item)
	}

	return newResults, pagination, err
}

func (s *UserService) FindById(id string, showPassword bool) (*models.User, error) {
	result, err := repositories.User().FindOneByQuery(bson.M{"id": id}, showPassword)
	if err != nil {
		return nil, err
	}

	if result.RoleId != "" {
		role, err := repositories.Role().FindOneByQuery(bson.M{"id": result.RoleId})
		if err == nil && role != nil {
			result.Role = *role
		}
	}

	return repositories.User().FindOneByQuery(bson.M{"id": id}, showPassword)
}

func (s *UserService) FindOneByQuery(filter bson.M) (*models.User, error) {
	return repositories.User().FindOneByQuery(filter, false)
}

func (s *UserService) Create(request models.User) (*models.User, error) {
	return repositories.User().Create(request)
}

func (s *UserService) Update(request models.User) (*models.User, error) {
	return repositories.User().Update(request)
}

func (s *UserService) Delete(id string) error {
	return repositories.User().Delete(id)
}
