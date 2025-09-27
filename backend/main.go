package main

import (
	"net/http"

	// "github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"example.com/TOUCHTHANAWAT/config"
	"example.com/TOUCHTHANAWAT/controller"
	"example.com/TOUCHTHANAWAT/middleware" // Update with your actual package path
)

const PORT = "8000"

func main() {
	// Connect to the database
	config.ConnectionDB()

	config.SetupDatabase()

	// Initialize Gin router
	r := gin.Default()

	// Set up CORS middleware
	r.Use(CORSMiddleware())

	// Register and login routes
	r.POST("/register", controller.Register)
	r.POST("/login", controller.Login)
	r.POST("/logout", controller.Logout)

	// Protected routes (require JWT authentication)
	auth := r.Group("/")
	auth.Use(middleware.JWTAuth())
	{
		auth.GET("/profile", controller.Profile) // Profile route accessible after authentication
		auth.GET("/ListInfo", controller.ListInfo)
		auth.GET("/ListCML/:id", controller.ListCML)
		auth.GET("/ListTestPoint/:id", controller.ListTestPoint)
		auth.GET("/ListThicknesses/:id", controller.ListThickness)
		auth.POST("/CreateInfo", controller.CreateInfo)
		auth.POST("/CreateCML/:id", controller.CreateCML)
		auth.POST("/CreateTestPoint/:id", controller.CreateTestPoint)
		auth.POST("/CreateThicknesses/:id", controller.CreateThickness)
		auth.GET("/GetCalAuto/:id", controller.GetCalculateByID)
		auth.DELETE("/DeleteCML/:id", controller.DeleteCML)
		auth.DELETE("/DeleteTestPoint/:id", controller.DeleteTestPoint)
		auth.DELETE("/DeleteThickness/:id", controller.DeleteThickness)
		auth.DELETE("/DeleteInfo/:id", controller.DeleteInfo)
		auth.GET("/GetInfo/:id", controller.GetInfoByID)
		auth.GET("/GetCml/:id", controller.GetCMLByID)
		auth.GET("/GetTestpoint/:id", controller.GetTestPointByID)
		auth.GET("/GetThickness/:id", controller.GetThicknessByID)
		auth.PATCH("/UpdateInfo/:id", controller.UpdateInfo)
		auth.PATCH("/UpdateCML/:id", controller.UpdateCML)
		auth.PATCH("/UpdateTestPoint/:id", controller.UpdateTestPoint)
		auth.PATCH("/UpdateThickness/:id", controller.UpdateThickness)
	}
	r.GET("/", func(c *gin.Context) {

		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)

	})
	// Run the server on the specified port
	r.Run("localhost:" + PORT)
}

// ฟังก์ชัน CORS middleware
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
