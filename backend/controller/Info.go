package controller

import (
	"math"
	"net/http"
	"time"

	"example.com/TOUCHTHANAWAT/config"
	"example.com/TOUCHTHANAWAT/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListInfo(c *gin.Context) {
	db := config.DB()
	var info []struct {
		ID                   uint      `json:"id"`
		LineNumber           string    `json:"line_number"`
		Location             string    `json:"location"`
		From                 string    `json:"from"`
		To                   string    `json:"to"`
		DrawingNumber        string    `json:"drawing_number"`
		Service              string    `json:"service"`
		Material             string    `json:"material"`
		InserviceDate        time.Time `json:"inservice_date"`
		PipeSize             float64   `json:"pipe_size"`
		OriginalThickness    float64   `json:"original_thickness"`
		Stress               uint      `json:"stress"`
		JointEfficiency      uint      `json:"joint_efficiency"`
		Ca                   uint      `json:"ca"`
		DesignLife           uint      `json:"design_life"`
		DesignPressure       uint      `json:"design_pressure"`
		OperatingPressure    uint      `json:"operating_pressure"`
		DesignTemperature    uint      `json:"design_temperature"`
		OperatingTemperature float64   `json:"operating_temperature"`
	}
	result := db.Model(&entity.Info{}).
		Select("infos.id", "infos.line_number", "infos.location", "`infos`.`from`", "`infos`.`to`", "infos.drawing_number", "infos.service", "infos.material", "infos.inservice_date",
			"infos.pipe_size", "infos.original_thickness", "infos.stress", "infos.joint_efficiency", "infos.ca", "infos.design_life", "infos.design_pressure", "infos.operating_pressure", "infos.design_temperature", "infos.operating_temperature").
		Where("infos.deleted_at IS NULL").
		Find(&info)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, &info)
}

func CreateInfo(c *gin.Context) {
    db := config.DB()

    var input struct {
        LineNumber           string    `json:"line_number"`
        Location             string    `json:"location"`
        From                 string    `json:"from"`
        To                   string    `json:"to"`
        DrawingNumber        string    `json:"drawing_number"`
        Service              string    `json:"service"`
        Material             string    `json:"material"`
        InserviceDate        time.Time `json:"inservice_date"`
        PipeSize             float64   `json:"pipe_size"`
        OriginalThickness    float64   `json:"original_thickness"`
        Stress               uint      `json:"stress"`
        JointEfficiency      uint      `json:"joint_efficiency"`
        Ca                   uint      `json:"ca"`
        DesignLife           uint      `json:"design_life"`
        DesignPressure       uint      `json:"design_pressure"`
        OperatingPressure    uint      `json:"operating_pressure"`
        DesignTemperature    uint      `json:"design_temperature"`
        OperatingTemperature float64   `json:"operating_temperature"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    info := entity.Info{
        LineNumber:           input.LineNumber,
        Location:             input.Location,
        From:                 input.From,
        To:                   input.To,
        DrawingNumber:        input.DrawingNumber,
        Service:              input.Service,
        Material:             input.Material,
        InserviceDate:        input.InserviceDate,
        PipeSize:             input.PipeSize,
        OriginalThickness:    input.OriginalThickness,
        Stress:               input.Stress,
        JointEfficiency:      input.JointEfficiency,
        Ca:                   input.Ca,
        DesignLife:           input.DesignLife,
        DesignPressure:       input.DesignPressure,
        OperatingPressure:    input.OperatingPressure,
        DesignTemperature:    input.DesignTemperature,
        OperatingTemperature: input.OperatingTemperature,
    }

    // บันทึกเข้า DB
    if err := db.Create(&info).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // ส่งกลับข้อมูลที่ถูกสร้าง
    c.JSON(http.StatusCreated, gin.H{"data": info})
}

func GetCalculateByID(c *gin.Context) {
	db := config.DB()
	id := c.Param("id") // ดึง id จาก URL

	var info entity.Info
	if err := db.First(&info, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Info not found"})
		return
	}

	// คำนวณค่าที่ต้องการ
	actualOD := config.FindOD(info.PipeSize)
	structThick := config.GetStructuralThickness(info.PipeSize)
	designThick := config.CalculateDesignThickness(
		float64(info.DesignPressure),
		actualOD,
		float64(info.Stress),
		float64(info.JointEfficiency),
	)
	requiredThick := math.Max(designThick, structThick)

	// สร้าง struct สำหรับ response
	type InfoResponse struct {
		ID                   uint      `json:"id"`
		LineNumber           string    `json:"line_number"`
		Location             string    `json:"location"`
		From                 string    `json:"from"`
		To                   string    `json:"to"`
		DrawingNumber        string    `json:"drawing_number"`
		Service              string    `json:"service"`
		Material             string    `json:"material"`
		InserviceDate        time.Time `json:"inservice_date"`
		PipeSize             float64   `json:"pipe_size"`
		OriginalThickness    float64   `json:"original_thickness"`
		Stress               uint      `json:"stress"`
		JointEfficiency      uint      `json:"joint_efficiency"`
		Ca                   uint      `json:"ca"`
		DesignLife           uint      `json:"design_life"`
		DesignPressure       uint      `json:"design_pressure"`
		OperatingPressure    uint      `json:"operating_pressure"`
		DesignTemperature    uint      `json:"design_temperature"`
		OperatingTemperature float64   `json:"operating_temperature"`

		// ค่าที่คำนวณ
		ActualOutsideDiameter float64 `json:"actual_outside_diameter"`
		StructuralThickness   float64 `json:"structural_thickness"`
		DesignThickness       float64 `json:"design_thickness"`
		RequiredThickness     float64 `json:"required_thickness"`
	}

	resp := InfoResponse{
		ID:                    info.ID,
		LineNumber:            info.LineNumber,
		Location:              info.Location,
		From:                  info.From,
		To:                    info.To,
		DrawingNumber:         info.DrawingNumber,
		Service:               info.Service,
		Material:              info.Material,
		InserviceDate:         info.InserviceDate,
		PipeSize:              info.PipeSize,
		OriginalThickness:     info.OriginalThickness,
		Stress:                info.Stress,
		JointEfficiency:       info.JointEfficiency,
		Ca:                    info.Ca,
		DesignLife:            info.DesignLife,
		DesignPressure:        info.DesignPressure,
		OperatingPressure:     info.OperatingPressure,
		DesignTemperature:     info.DesignTemperature,
		OperatingTemperature:  info.OperatingTemperature,
		ActualOutsideDiameter: actualOD,
		StructuralThickness:   structThick,
		DesignThickness:       designThick,
		RequiredThickness:     requiredThick,
	}

	c.JSON(http.StatusOK, resp)
}

func GetInfoByID(c *gin.Context) {
	db := config.DB()
	id := c.Param("id") // รับ id จาก URL parameter

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}

	var info struct {
		ID                   uint      `json:"id"`
		LineNumber           string    `json:"line_number"`
		Location             string    `json:"location"`
		From                 string    `json:"from"`
		To                   string    `json:"to"`
		DrawingNumber        string    `json:"drawing_number"`
		Service              string    `json:"service"`
		Material             string    `json:"material"`
		InserviceDate        time.Time `json:"inservice_date"`
		PipeSize             float64   `json:"pipe_size"`
		OriginalThickness    float64   `json:"original_thickness"`
		Stress               uint      `json:"stress"`
		JointEfficiency      uint      `json:"joint_efficiency"`
		Ca                   uint      `json:"ca"`
		DesignLife           uint      `json:"design_life"`
		DesignPressure       uint      `json:"design_pressure"`
		OperatingPressure    uint      `json:"operating_pressure"`
		DesignTemperature    uint      `json:"design_temperature"`
		OperatingTemperature float64   `json:"operating_temperature"`
	}

	result := db.Model(&entity.Info{}).
		Select("infos.id", "infos.line_number", "infos.location", "`infos`.`from`", "`infos`.`to`", "infos.drawing_number", "infos.service", "infos.material", "infos.inservice_date",
			"infos.pipe_size", "infos.original_thickness", "infos.stress", "infos.joint_efficiency", "infos.ca", "infos.design_life", "infos.design_pressure", "infos.operating_pressure", "infos.design_temperature", "infos.operating_temperature").
		Where("infos.id = ? AND infos.deleted_at IS NULL", id).
		First(&info)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Info not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, info)
}

func UpdateInfo(c *gin.Context) {
    db := config.DB()
    id := c.Param("id") // ดึง id จาก URL

    // หา record ที่ต้องการอัปเดต
    var info entity.Info
    if err := db.First(&info, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "ข้อมูลไม่พบ"})
        return
    }

    // รับข้อมูลใหม่จาก client
    var input struct {
        LineNumber           string    `json:"line_number"`
        Location             string    `json:"location"`
        From                 string    `json:"from"`
        To                   string    `json:"to"`
        DrawingNumber        string    `json:"drawing_number"`
        Service              string    `json:"service"`
        Material             string    `json:"material"`
        InserviceDate        time.Time `json:"inservice_date"`
        PipeSize             float64   `json:"pipe_size"`
        OriginalThickness    float64   `json:"original_thickness"`
        Stress               uint      `json:"stress"`
        JointEfficiency      uint      `json:"joint_efficiency"`
        Ca                   uint      `json:"ca"`
        DesignLife           uint      `json:"design_life"`
        DesignPressure       uint      `json:"design_pressure"`
        OperatingPressure    uint      `json:"operating_pressure"`
        DesignTemperature    uint      `json:"design_temperature"`
        OperatingTemperature float64   `json:"operating_temperature"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // อัปเดตข้อมูล
    updatedInfo := entity.Info{
        LineNumber:           input.LineNumber,
        Location:             input.Location,
        From:                 input.From,
        To:                   input.To,
        DrawingNumber:        input.DrawingNumber,
        Service:              input.Service,
        Material:             input.Material,
        InserviceDate:        input.InserviceDate,
        PipeSize:             input.PipeSize,
        OriginalThickness:    input.OriginalThickness,
        Stress:               input.Stress,
        JointEfficiency:      input.JointEfficiency,
        Ca:                   input.Ca,
        DesignLife:           input.DesignLife,
        DesignPressure:       input.DesignPressure,
        OperatingPressure:    input.OperatingPressure,
        DesignTemperature:    input.DesignTemperature,
        OperatingTemperature: input.OperatingTemperature,
    }

    if err := db.Model(&info).Updates(updatedInfo).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": info})
}

func DeleteInfo(c *gin.Context) {
    db := config.DB()
    id := c.Param("id")

    if id == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
        return
    }

    var info entity.Info
    if err := db.First(&info, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "info not found"})
        return
    }

    // Soft delete
    if err := db.Delete(&info).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "info deleted successfully"})
}
