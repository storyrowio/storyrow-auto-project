package routes

import (
	"github.com/gin-gonic/gin"
	"with-go-api/internal/handlers"
)

func RegisterRoutes(api *gin.RouterGroup) {
	user := api.Group("/users")
	{
		user.POST("/system-admin", handlers.User().CreateSystemAdmin)
		
		user.GET("", handlers.User().FindByQuery)
		user.GET("/:id", handlers.User().FindByID)
		user.POST("", handlers.User().Create)
		user.PATCH("/:id", handlers.User().Update)
		user.DELETE("/:id", handlers.User().Delete)
	}
}
