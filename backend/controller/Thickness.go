package controller

import (
	"net/http"
	"strconv"
	"time"

	"example.com/TOUCHTHANAWAT/config"
	"example.com/TOUCHTHANAWAT/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListThickness(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}
	var TestPoint []struct {
		ID              uint      `json:"id"`
		InspectionDate  time.Time `json:"inspection_date"`
		ActualThickness string    `json:"actual_thickness"`
		TpNumber        uint      `json:"tp_number"`
		LineNumber      string    `json:"line_number"`
		CmlNumber       uint      `json:"cml_number"`
	}
	result := db.Model(&entity.Thickness{}).
		Select("thicknesses.id", "infos.line_number", "cmls.cml_number", "test_points.tp_number", "thicknesses.inspection_date", "thicknesses.actual_thickness").
		Joins("inner join test_points on thicknesses.test_point_id = test_points.id ").
		Joins("inner join cmls on test_points.cml_id = cmls.id ").
		Joins("inner join infos on cmls.info_id = infos.id ").
		Where("thicknesses.test_point_id = ? AND thicknesses.deleted_at IS NULL", id).
		Find(&TestPoint)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, &TestPoint)
}

func CreateThickness(c *gin.Context) {
	db := config.DB()

	// รับ test_point_id จาก URL param
	tpID := c.Param("id")
	if tpID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "test_point_id is required"})
		return
	}

	// Struct สำหรับรับ JSON body
	var input struct {
		InspectionDate  string `json:"inspection_date"`  // รับเป็น string "YYYY-MM-DD"
		ActualThickness string `json:"actual_thickness"` // ตัวเลข/ข้อความ
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// แปลง InspectionDate เป็น time.Time
	var inspectionDate time.Time
	if input.InspectionDate != "" {
		t, err := time.Parse("2006-01-02", input.InspectionDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format, use YYYY-MM-DD"})
			return
		}
		inspectionDate = t
	}

	// สร้าง entity.Thickness
	thickness := entity.Thickness{
		TestPointID:    StringToUint(tpID),
		InspectionDate: inspectionDate,
		ActualThickness: input.ActualThickness,
	}

	if err := db.Create(&thickness).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": thickness})
}

func StringToUint(s string) uint {
	id, err := strconv.ParseUint(s, 10, 64)
	if err != nil {
		return 0
	}
	return uint(id)
}

func DeleteThickness(c *gin.Context) {
    db := config.DB()
    id := c.Param("id")

    if id == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
        return
    }

    var ts entity.Thickness
    if err := db.First(&ts, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Thickness not found"})
        return
    }

    // Soft delete
    if err := db.Delete(&ts).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Thickness deleted successfully"})
}

func GetThicknessByID(c *gin.Context) {
	db := config.DB()
	id := c.Param("id") // รับ Thickness id จาก URL param
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thickness ID is required"})
		return
	}

	var thickness struct {
		ID              uint      `json:"id"`
		InspectionDate  time.Time `json:"inspection_date"`
		ActualThickness string    `json:"actual_thickness"`
		TpNumber        uint      `json:"tp_number"`
		LineNumber      string    `json:"line_number"`
		CmlNumber       uint      `json:"cml_number"`
	}

	result := db.Model(&entity.Thickness{}).
		Select("thicknesses.id", "infos.line_number", "cmls.cml_number", "test_points.tp_number", "thicknesses.inspection_date", "thicknesses.actual_thickness").
		Joins("inner join test_points on thicknesses.test_point_id = test_points.id").
		Joins("inner join cmls on test_points.cml_id = cmls.id").
		Joins("inner join infos on cmls.info_id = infos.id").
		Where("thicknesses.id = ? AND thicknesses.deleted_at IS NULL", id).
		First(&thickness)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Thickness not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, thickness)
}

func UpdateThickness(c *gin.Context) {
	db := config.DB()

	// รับ thickness_id จาก URL param
	thicknessID := c.Param("id")
	if thicknessID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "thickness_id is required"})
		return
	}

	// หา record ก่อน
	var thickness entity.Thickness
	if err := db.First(&thickness, thicknessID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Thickness not found"})
		return
	}

	// Struct สำหรับรับ JSON body
	var input struct {
		InspectionDate  string `json:"inspection_date"`  // รับเป็น string "YYYY-MM-DD"
		ActualThickness string `json:"actual_thickness"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// แปลง InspectionDate เป็น time.Time
	var inspectionDate time.Time
	if input.InspectionDate != "" {
		t, err := time.Parse("2006-01-02", input.InspectionDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format, use YYYY-MM-DD"})
			return
		}
		inspectionDate = t
	}

	// อัปเดตข้อมูล
	updatedThickness := entity.Thickness{
		InspectionDate:  inspectionDate,
		ActualThickness: input.ActualThickness,
	}

	if err := db.Model(&thickness).Updates(updatedThickness).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": thickness})
}
