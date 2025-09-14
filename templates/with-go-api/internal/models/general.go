package models

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"strings"
	"time"
)

type BasicDate struct {
	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" bson:"updatedAt"`
}

type Query struct {
	Limit int    `form:"limit" json:"limit"`
	Page  int    `form:"page" json:"page"`
	Sort  string `form:"sort" json:"sort"`
}

type Pagination struct {
	Page       int `json:"page"`
	Total      int `json:"total"`
	TotalPages int `json:"totalPages"`
	Limit      int `json:"limit"`
}

type Response struct {
	StatusCode int         `json:"statusCode"`
	Message    string      `json:"message,omitempty"`
	Data       interface{} `json:"data,omitempty"`
	Pagination *Pagination `json:"pagination,omitempty"`
	Errors     interface{} `json:"errors,omitempty"`
}

func (q Query) ParseQueryOptions() *options.FindOptionsBuilder {
	opts := options.Find()

	if q.Limit > 0 {
		opts.SetLimit(int64(q.Limit))
	}

	if q.Page > 0 {
		opts.SetSkip(int64(q.Page * q.Limit))
	}

	if q.Sort != "" {
		splitSort := strings.Split(q.Sort, ",")
		opts.SetSort(bson.M{splitSort[0]: splitSort[1]})
	}

	return opts
}
