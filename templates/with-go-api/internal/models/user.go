package models

import "go.mongodb.org/mongo-driver/v2/bson"

type User struct {
	ID       string `json:"id"`
	RoleId   string `json:"roleId" bson:"roleId"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password,omitempty"`

	Role Role `json:"role,omitempty" bson:"-"`

	BasicDate `bson:",inline"`
}

type UserQuery struct {
	Filter         bson.M
	Query          `form:",inline"`
	ShowPassword   bool `form:"showPassword" default:"false"`
	WithPagination bool `form:"withPagination"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}
