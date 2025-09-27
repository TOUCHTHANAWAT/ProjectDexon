package middleware

import (
	"example.com/TOUCHTHANAWAT/services"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
			c.Abort()
			return
		}

		// ตัดคำว่า "Bearer " ออกจาก tokenString
		tokenString = strings.TrimPrefix(tokenString, "Bearer ")

		username, err := services.VerifyToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.JSON(http.StatusUnauthorized, gin.H{"error": tokenString})
			c.Abort()
			return
		}

		// กำหนดค่า "username" ใน context เพื่อให้ใช้ใน handler ถัดไป
		c.Set("username", username)
		c.Next()
	}
}
