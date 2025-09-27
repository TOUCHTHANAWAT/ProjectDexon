package controller

import (
	"net/http"
	"strconv"

	"example.com/TOUCHTHANAWAT/config"
	"example.com/TOUCHTHANAWAT/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListCML(c *gin.Context) {
	db := config.DB()
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}
	var CML []struct {
		ID                    uint    `json:"id"`
		CmlNumber             uint    `json:"cml_number"`
		CmlDescription        string  `json:"cml_description"`
		ActualOutsideDiameter float64 `json:"actual_outside_diameter"`
		DesignThickness       float64 `json:"design_thickness"`
		StructuralThickness   float64 `json:"structural_thickness"`
		RequiredThickness     float64 `json:"required_thickness"`
		LineNumber            string  `json:"line_number"`
	}
	result := db.Model(&entity.CML{}).
		Select("cmls.id", "infos.line_number", "cmls.cml_number", "cmls.cml_description", "cmls.actual_outside_diameter", "cmls.design_thickness", "cmls.structural_thickness", "cmls.required_thickness").
		Joins("inner join infos on cmls.info_id = infos.id ").
		Where("cmls.info_id = ? AND cmls.deleted_at IS NULL", id).
		Find(&CML)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, &CML)
}

func CreateCML(c *gin.Context) {
	db := config.DB()
	infoID := c.Param("id") // รับ info_id จาก URL param
	if infoID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "info_id is required"})
		return
	}

	// Struct สำหรับรับ JSON body
	var input struct {
		CmlNumber             uint    `json:"cml_number"`
		CmlDescription        string  `json:"cml_description"`
		ActualOutsideDiameter float64 `json:"actual_outside_diameter"`
		DesignThickness       float64 `json:"design_thickness"`
		StructuralThickness   float64 `json:"structural_thickness"`
		RequiredThickness     float64 `json:"required_thickness"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// สร้าง entity.CML
	cml := entity.CML{
		InfoID:                parseUint(infoID), // แปลง string เป็น uint
		CmlNumber:             input.CmlNumber,
		CmlDescription:        input.CmlDescription,
		ActualOutsideDiameter: input.ActualOutsideDiameter,
		DesignThickness:       input.DesignThickness,
		StructuralThickness:   input.StructuralThickness,
		RequiredThickness:     input.RequiredThickness,
	}

	if err := db.Create(&cml).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": cml})
}

// helper function แปลง string -> uint
func parseUint(s string) uint {
	id, err := strconv.ParseUint(s, 10, 64)
	if err != nil {
		return 0
	}
	return uint(id)
}

func DeleteCML(c *gin.Context) {
    db := config.DB()
    id := c.Param("id")

    if id == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
        return
    }

    var cml entity.CML
    if err := db.First(&cml, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "CML not found"})
        return
    }

    // Soft delete
    if err := db.Delete(&cml).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "CML deleted successfully"})
}

func GetCMLByID(c *gin.Context) {
	db := config.DB()
	id := c.Param("id") // รับ CML id จาก URL param
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CML ID is required"})
		return
	}

	var cml struct {
		ID                    uint    `json:"id"`
		CmlNumber             uint    `json:"cml_number"`
		CmlDescription        string  `json:"cml_description"`
		ActualOutsideDiameter float64 `json:"actual_outside_diameter"`
		DesignThickness       float64 `json:"design_thickness"`
		StructuralThickness   float64 `json:"structural_thickness"`
		RequiredThickness     float64 `json:"required_thickness"`
		LineNumber            string  `json:"line_number"`
	}

	result := db.Model(&entity.CML{}).
		Select("cmls.id", "infos.line_number", "cmls.cml_number", "cmls.cml_description", "cmls.actual_outside_diameter", "cmls.design_thickness", "cmls.structural_thickness", "cmls.required_thickness").
		Joins("inner join infos on cmls.info_id = infos.id").
		Where("cmls.id = ? AND cmls.deleted_at IS NULL", id).
		First(&cml)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "CML not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, cml)
}

func UpdateCML(c *gin.Context) {
	db := config.DB()
	cmlID := c.Param("id") // รับ cml_id จาก URL param
	if cmlID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cml_id is required"})
		return
	}

	// หา record ก่อน
	var cml entity.CML
	if err := db.First(&cml, cmlID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "CML not found"})
		return
	}

	// Struct สำหรับรับ JSON body
	var input struct {
		CmlNumber             uint    `json:"cml_number"`
		CmlDescription        string  `json:"cml_description"`
		ActualOutsideDiameter float64 `json:"actual_outside_diameter"`
		DesignThickness       float64 `json:"design_thickness"`
		StructuralThickness   float64 `json:"structural_thickness"`
		RequiredThickness     float64 `json:"required_thickness"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัปเดตข้อมูล
	updatedCML := entity.CML{
		CmlNumber:             input.CmlNumber,
		CmlDescription:        input.CmlDescription,
		ActualOutsideDiameter: input.ActualOutsideDiameter,
		DesignThickness:       input.DesignThickness,
		StructuralThickness:   input.StructuralThickness,
		RequiredThickness:     input.RequiredThickness,
	}

	if err := db.Model(&cml).Updates(updatedCML).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cml})
}
