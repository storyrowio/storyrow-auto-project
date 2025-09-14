package models

type Role struct {
	ID          string   `json:"id" bson:"id"`
	Name        string   `json:"name" bson:"name"`
	Code        string   `json:"code" bson:"code"`
	Description string   `json:"description" bson:"description"`
	Permissions []string `json:"permissions" bson:"permissions"`
	BasicDate   `bson:",inline"`
}

type Permission struct {
	ID   string `json:"id"` // e.g. user:create
	Name string `json:"name"`
}
