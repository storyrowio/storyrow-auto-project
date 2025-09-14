package pkg

import (
	"github.com/gin-gonic/gin"
	"with-go-api/internal/models"
)

func ResponseJson(c *gin.Context, response *models.Response) {
	c.SecureJSON(response.StatusCode, response)
}

func ResponseJsonError(c *gin.Context, statusCode int, err error) {
	c.SecureJSON(statusCode, models.Response{
		StatusCode: statusCode,
		Errors: []string{
			err.Error(),
		},
	})
}
