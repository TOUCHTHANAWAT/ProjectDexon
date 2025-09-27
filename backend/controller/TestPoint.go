package controller

import (
	"net/http"
	"strconv"

	"example.com/TOUCHTHANAWAT/config"
	"example.com/TOUCHTHANAWAT/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListTestPoint(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}
	var TestPoint []struct {
		ID            uint   `json:"id"`
		TpNumber      uint   `json:"tp_number"`
		TpDescription uint   `json:"tp_description"`
		Note          string `json:"note"`
		LineNumber    string `json:"line_number"`
		CmlNumber     uint   `json:"cml_number"`
	}
	result := db.Model(&entity.TestPoint{}).
		Select("test_points.id", "infos.line_number", "cmls.cml_number", "test_points.tp_number", "test_points.tp_description", "test_points.note").
		Joins("inner join cmls on test_points.cml_id = cmls.id ").
		Joins("inner join infos on cmls.info_id = infos.id ").
		Where("test_points.cml_id = ? AND test_points.deleted_at IS NULL", id).
		Find(&TestPoint)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, &TestPoint)
}

func CreateTestPoint(c *gin.Context) {
	db := config.DB()
	cmlID := c.Param("id") // รับ cml_id จาก URL param
	if cmlID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cml_id is required"})
		return
	}

	// Struct สำหรับรับ JSON body
	var input struct {
		TpNumber      uint   `json:"tp_number"`
		TpDescription uint   `json:"tp_description"`
		Note          string `json:"note"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// สร้าง entity.TestPoint
	testPoint := entity.TestPoint{
		CMLID:         parseUintCML(cmlID),
		TpNumber:      input.TpNumber,
		TpDescription: input.TpDescription,
		Note:          input.Note,
	}

	if err := db.Create(&testPoint).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": testPoint})
}

func parseUintCML(s string) uint {
	id, err := strconv.ParseUint(s, 10, 64)
	if err != nil {
		return 0
	}
	return uint(id)
}

func DeleteTestPoint(c *gin.Context) {
    db := config.DB()
    id := c.Param("id")

    if id == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
        return
    }

    var tp entity.TestPoint
    if err := db.First(&tp, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "TestPoint not found"})
        return
    }

    // Soft delete
    if err := db.Delete(&tp).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "TestPoint deleted successfully"})
}

func GetTestPointByID(c *gin.Context) {
	db := config.DB()
	id := c.Param("id") // รับ TestPoint id จาก URL param
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "TestPoint ID is required"})
		return
	}

	var tp struct {
		ID            uint   `json:"id"`
		TpNumber      uint   `json:"tp_number"`
		TpDescription uint   `json:"tp_description"`
		Note          string `json:"note"`
		LineNumber    string `json:"line_number"`
		CmlNumber     uint   `json:"cml_number"`
	}

	result := db.Model(&entity.TestPoint{}).
		Select("test_points.id", "infos.line_number", "cmls.cml_number", "test_points.tp_number", "test_points.tp_description", "test_points.note").
		Joins("inner join cmls on test_points.cml_id = cmls.id").
		Joins("inner join infos on cmls.info_id = infos.id").
		Where("test_points.id = ? AND test_points.deleted_at IS NULL", id).
		First(&tp)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "TestPoint not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, tp)
}

func UpdateTestPoint(c *gin.Context) {
	db := config.DB()
	tpID := c.Param("id") // รับ tp_id จาก URL param
	if tpID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tp_id is required"})
		return
	}

	// หา record ก่อน
	var tp entity.TestPoint
	if err := db.First(&tp, tpID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "TestPoint not found"})
		return
	}

	// Struct สำหรับรับ JSON body
	var input struct {
		TpNumber      uint   `json:"tp_number"`
		TpDescription uint   `json:"tp_description"`
		Note          string `json:"note"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัปเดตข้อมูล
	updatedTP := entity.TestPoint{
		TpNumber:      input.TpNumber,
		TpDescription: input.TpDescription,
		Note:          input.Note,
	}

	if err := db.Model(&tp).Updates(updatedTP).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tp})
}
