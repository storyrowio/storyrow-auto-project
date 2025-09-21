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

type UserHandler struct{}

func User() *UserHandler {
	return &UserHandler{}
}

func (h *UserHandler) FindByQuery(c *gin.Context) {
	var query models.UserQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		pkg.ResponseJsonError(c, http.StatusBadRequest, err)
		return
	}

	results, pagination, err := services.User().FindByQuery(query)
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	pkg.ResponseJson(c, &models.Response{StatusCode: http.StatusOK, Data: results, Pagination: pagination})
}

func (h *UserHandler) FindByID(c *gin.Context) {
	id := c.Param("id")

	result, err := services.User().FindById(id, false)
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	pkg.ResponseJson(c, &models.Response{StatusCode: http.StatusOK, Data: result})
}

func (h *UserHandler) Create(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		pkg.ResponseJsonError(c, http.StatusBadRequest, err)
		return
	}

	result, err := services.User().Create(user)
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	pkg.ResponseJson(c, &models.Response{StatusCode: http.StatusOK, Data: result})
}

func (h *UserHandler) Update(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		pkg.ResponseJsonError(c, http.StatusBadRequest, err)
		return
	}

	result, err := services.User().Update(user)
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	pkg.ResponseJson(c, &models.Response{StatusCode: http.StatusOK, Data: result})
}

func (h *UserHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	err := services.User().Delete(id)
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	pkg.ResponseJson(c, &models.Response{StatusCode: http.StatusOK, Message: "Success"})
}

func (h *UserHandler) CreateSystemAdmin(c *gin.Context) {
	var request models.LoginRequest
	err := c.ShouldBindJSON(&request)
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusBadRequest, err)
		return
	}

	if request.Email != "admin@example.com" || request.Password != "admin" {
		pkg.ResponseJsonError(c, http.StatusBadRequest, errors.New("forbidden access"))
		return
	}

	role, err := services.Role().FindByCode("systemAdmin")
	if err != nil || role == nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	userAdmin, _ := services.User().FindOneByQuery(bson.M{"roleId": role.ID})
	if userAdmin != nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, errors.New("forbidden access"))
		return
	}

	password, err := bcrypt.GenerateFromPassword([]byte("admin"), bcrypt.DefaultCost)
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	user := models.User{
		ID:       uuid.New().String(),
		RoleId:   role.ID,
		Name:     "Administrator",
		Email:    "admin@example.com",
		Password: string(password),
		BasicDate: models.BasicDate{
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}

	res, err := services.User().Create(user)
	if err != nil || res == nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	pkg.ResponseJson(c, &models.Response{StatusCode: http.StatusOK, Data: res})
}
