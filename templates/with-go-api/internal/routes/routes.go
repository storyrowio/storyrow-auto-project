package routes

import (
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"with-go-api/internal/handlers"
)

func RegisterRoutes(api *gin.RouterGroup, authMiddleware *jwt.GinJWTMiddleware) {
	user := api.Group("/users")
	{
		user.POST("/system-admin", handlers.User().CreateSystemAdmin)

		userProtected := user.Group("/")
		{
			userProtected.Use(authMiddleware.MiddlewareFunc())

			userProtected.GET("", handlers.User().FindByQuery)
			userProtected.GET("/:id", handlers.User().FindByID)
			userProtected.POST("", handlers.User().Create)
			userProtected.PATCH("/:id", handlers.User().Update)
			userProtected.DELETE("/:id", handlers.User().Delete)
		}
	}
}
