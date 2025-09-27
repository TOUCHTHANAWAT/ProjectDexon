package entity

import (
	"gorm.io/gorm"
	"time"
)

type Info struct {
	gorm.Model
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
	OperatingTemperature float64      `json:"operating_temperature"`

	CML []CML `gorm:"foreignKey:InfoID" valid:"-"`
}