package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func Profile(c *gin.Context) {
	username := c.MustGet("username").(string)
	c.JSON(http.StatusOK, gin.H{"message": "Welcome " + username})
}
