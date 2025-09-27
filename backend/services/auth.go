package services

import (
	"errors"
	"golang.org/x/crypto/bcrypt"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

var jwtKey = []byte("my_secret_key")

// Claims struct จะเก็บข้อมูลที่จะฝังไว้ใน JWT
type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

// GenerateToken จะใช้ในการสร้าง JWT token ที่มีวันหมดอายุ 24 ชั่วโมง
func GenerateToken(username string) (string, error) {
	exp := time.Now().Add(24 * time.Hour) // กำหนดวันหมดอายุของ token
	claims := &Claims{
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: exp.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey) // เซ็น token และคืนค่า
}

// VerifyToken ใช้ในการตรวจสอบ token ว่าถูกต้องหรือไม่
func VerifyToken(tokenStr string) (string, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	// ตรวจสอบว่ามี error หรือ token ไม่ valid
	if err != nil || !token.Valid {
		return "", errors.New("invalid token")
	}

	// คืนค่า username ที่ฝังไว้ใน token
	return claims.Username, nil
}

// HashPassword ใช้ในการเข้ารหัสรหัสผ่านก่อนบันทึกลงในฐานข้อมูล
func HashPassword(password string) (string, error) {
	// ใช้ bcrypt เพื่อเข้ารหัสรหัสผ่าน
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// CheckPasswordHash ใช้ในการตรวจสอบว่ารหัสผ่านที่กรอกตรงกับรหัสผ่านที่เข้ารหัสไว้ในฐานข้อมูลหรือไม่
func CheckPasswordHash(password, hashedPassword string) bool {
	// ใช้ bcrypt ในการตรวจสอบรหัสผ่าน
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
