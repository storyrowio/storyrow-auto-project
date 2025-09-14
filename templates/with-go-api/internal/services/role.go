package services

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"with-go-api/internal/models"
	"with-go-api/internal/repositories"
)

type RoleService struct{}

func Role() *RoleService {
	return &RoleService{}
}

func (s *RoleService) FindAll() ([]models.Role, error) {
	return repositories.Role().FindAll()
}

func (s *RoleService) FindById(id string) (*models.Role, error) {
	return repositories.Role().FindOneByQuery(bson.M{"id": id})
}

func (s *RoleService) FindByCode(code string) (*models.Role, error) {
	return repositories.Role().FindOneByQuery(bson.M{"code": code})
}

func (s *RoleService) Create(request models.Role) (*models.Role, error) {
	return repositories.Role().Create(request)
}

func (s *RoleService) Update(request models.Role) (*models.Role, error) {
	return repositories.Role().Update(request)
}

func (s *RoleService) Delete(id string) error {
	return repositories.Role().Delete(id)
}
