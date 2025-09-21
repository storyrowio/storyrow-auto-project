package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"os"
	"with-go-api/internal/config"
	"with-go-api/internal/db"
	"with-go-api/internal/handlers"
	"with-go-api/internal/middlewares"
	"with-go-api/internal/repositories"
	"with-go-api/internal/routes"
)

func main() {
	if os.Getenv("ENVIRONMENT") != "production" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	cfg := config.Load()

	_, database := db.Connect(cfg)

	repositories.Init(database)

	authMiddleware := middlewares.AuthMiddleware()

	router := gin.Default()
	router.Use(gin.Recovery())

	api := router.Group("/api")
	{
		api.POST("/login", authMiddleware.LoginHandler)
		api.POST("/register", handlers.Auth().Register)

		routes.RegisterRoutes(api, authMiddleware)
	}

	err := router.Run(cfg.ServerAddress)
	if err != nil {
		panic(err)
	}
}
