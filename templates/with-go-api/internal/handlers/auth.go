package handlers

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/v2/bson"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"time"
	"with-go-api/internal/models"
	"with-go-api/internal/pkg"
	"with-go-api/internal/services"
)

type AuthHandler struct{}

func Auth() *AuthHandler {
	return &AuthHandler{}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var request models.RegisterRequest
	err := c.ShouldBindJSON(&request)
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusBadRequest, err)
		return
	}

	exist, err := services.User().FindOneByQuery(bson.M{"email": request.Email})
	if err == nil && exist != nil {
		pkg.ResponseJsonError(c, http.StatusConflict, errors.New("email already taken"))
		return
	}

	password, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)

	user := models.User{
		ID:       uuid.New().String(),
		RoleId:   "",
		Name:     request.Name,
		Email:    request.Email,
		Password: string(password),
		BasicDate: models.BasicDate{
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}

	res, err := services.User().Create(user)
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	pkg.ResponseJson(c, &models.Response{StatusCode: http.StatusOK, Data: res})
}
