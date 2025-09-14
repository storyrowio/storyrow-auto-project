package middlewares

import (
	"errors"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"log"
	"net/http"
	"os"
	"time"
	"with-go-api/internal/models"
	"with-go-api/internal/pkg"
	"with-go-api/internal/repositories"
)

func AuthMiddleware() *jwt.GinJWTMiddleware {
	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Realm:           os.Getenv("JWT_REALM"),
		Key:             []byte(os.Getenv("JWT_SECRET")),
		Timeout:         24 * time.Hour,
		MaxRefresh:      24 * time.Hour,
		PayloadFunc:     payloadFunc(),
		IdentityHandler: identityHandler(),
		Authenticator:   authenticator(),
		Authorizator: func(data interface{}, c *gin.Context) bool {
			if _, ok := data.(*models.User); ok {
				return true
			}

			return false
		},
		Unauthorized: func(c *gin.Context, code int, message string) {
			pkg.ResponseJsonError(c, code, errors.New(message))
			return
		},
		LoginResponse: func(c *gin.Context, code int, token string, expire time.Time) {
			pkg.ResponseJson(c, &models.Response{
				StatusCode: code,
				Data:       map[string]interface{}{"token": token, "expire": expire.String()},
			})
		},
		SendCookie:     true,
		SecureCookie:   true,
		CookieHTTPOnly: true,
		CookieName:     os.Getenv("JWT_COOKIE_NAME"),
		CookieSameSite: http.SameSiteLaxMode,
		TokenLookup:    "header: Authorization, query: token, cookie: " + os.Getenv("JWT_COOKIE_NAME"),
		TokenHeadName:  "Bearer",
		TimeFunc:       time.Now,
	})

	if err != nil {
		log.Fatal(err)
	}

	return authMiddleware
}

func payloadFunc() func(data interface{}) jwt.MapClaims {
	return func(data interface{}) jwt.MapClaims {
		if v, ok := data.(*models.User); ok {
			return jwt.MapClaims{
				"email": v.Email,
				"role":  v.Role,
			}
		}
		return jwt.MapClaims{}
	}
}

func identityHandler() func(c *gin.Context) interface{} {
	return func(c *gin.Context) interface{} {
		claims := jwt.ExtractClaims(c)
		return &models.User{
			Email: claims["email"].(string),
			Role:  claims["role"].(models.Role),
		}
	}
}

func authenticator() func(c *gin.Context) (interface{}, error) {
	return func(c *gin.Context) (interface{}, error) {
		var request models.LoginRequest
		if err := c.ShouldBindJSON(&request); err != nil {
			return "", jwt.ErrMissingLoginValues
		}

		user, err := repositories.User().FindOneByQuery(bson.M{"email": request.Email}, false)
		if err != nil {
			return nil, err
		}

		if user != nil {
			return user, nil
		}

		return nil, jwt.ErrFailedAuthentication
	}
}
