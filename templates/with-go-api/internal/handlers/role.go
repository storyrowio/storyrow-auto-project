package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"with-go-api/internal/models"
	"with-go-api/internal/pkg"
	"with-go-api/internal/services"
)

type RoleHandler struct{}

func Role() *RoleHandler {
	return &RoleHandler{}
}

func (h *RoleHandler) FindAll(c *gin.Context) {
	results, err := services.Role().FindAll()
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	pkg.ResponseJson(c, &models.Response{StatusCode: http.StatusOK, Data: results})
}

func (h *RoleHandler) FindByID(c *gin.Context) {
	id := c.Param("id")

	result, err := services.Role().FindById(id)
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	pkg.ResponseJson(c, &models.Response{StatusCode: http.StatusOK, Data: result})
}

func (h *RoleHandler) Create(c *gin.Context) {
	var Role models.Role
	if err := c.ShouldBindJSON(&Role); err != nil {
		pkg.ResponseJsonError(c, http.StatusBadRequest, err)
		return
	}

	result, err := services.Role().Create(Role)
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	pkg.ResponseJson(c, &models.Response{StatusCode: http.StatusOK, Data: result})
}

func (h *RoleHandler) Update(c *gin.Context) {
	var request models.Role
	if err := c.ShouldBindJSON(&request); err != nil {
		pkg.ResponseJsonError(c, http.StatusBadRequest, err)
		return
	}

	result, err := services.Role().Update(request)
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	pkg.ResponseJson(c, &models.Response{StatusCode: http.StatusOK, Data: result})
}

func (h *RoleHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	err := services.Role().Delete(id)
	if err != nil {
		pkg.ResponseJsonError(c, http.StatusInternalServerError, err)
		return
	}

	pkg.ResponseJson(c, &models.Response{StatusCode: http.StatusOK, Message: "Success"})
}
