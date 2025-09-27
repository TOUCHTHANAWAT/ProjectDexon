package controller

import (
	"net/http"
	"example.com/TOUCHTHANAWAT/config"
	"example.com/TOUCHTHANAWAT/entity"
	"example.com/TOUCHTHANAWAT/services"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Register(c *gin.Context) {
	var user entity.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// ตรวจสอบว่ามีผู้ใช้ที่ชื่อผู้ใช้นี้อยู่แล้วหรือไม่
	var existingUser entity.User
	err := config.DB().Where("username = ?", user.Username).First(&existingUser).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check if user exists"})
		return
	}
	// ถ้าพบผู้ใช้ที่มีชื่อผู้ใช้นี้แล้ว
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	// แฮชรหัสผ่านก่อนที่จะบันทึก
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = string(hashedPassword)

	// เพิ่มผู้ใช้ลงในฐานข้อมูล
	if err := config.DB().Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Registered successfully"})
}

func Login(c *gin.Context) {
	var user entity.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var existingUser entity.User
	// ค้นหาผู้ใช้โดยใช้ชื่อผู้ใช้
	if err := config.DB().Where("username = ?", user.Username).First(&existingUser).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate user"})
		}
		return
	}

	// เปรียบเทียบรหัสผ่านที่แฮชแล้ว
	err := bcrypt.CompareHashAndPassword([]byte(existingUser.Password), []byte(user.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// สร้าง JWT token
	token, err := services.GenerateToken(user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
    "token": token,
    "token_type": "Bearer",
})
}

func Logout(c *gin.Context) {
	// การลบ JWT token จริงๆ จะเกิดขึ้นที่ฝั่ง client
	// เช่น การลบ token ใน localStorage หรือ cookies ของ frontend

	// ถ้าใช้ cookies ใน frontend, สามารถส่ง cookie ที่หมดอายุให้ browser ลบได้
	c.SetCookie("token", "", -1, "/", "localhost", false, true) // ลบ cookie ที่ชื่อ "token"
	
	// ส่งข้อความตอบกลับให้ client
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}
