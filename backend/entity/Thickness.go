package entity

import (
	"gorm.io/gorm"
	"time"
)

type Thickness struct {
	gorm.Model
	InspectionDate  time.Time `json:"inspection_date"`
	ActualThickness string    `json:"actual_thickness"`

	TestPointID uint      `valid:"required~TestPointID is required"`
	TestPoint   *TestPoint `gorm:"foreignKey:TestPointID" valid:"-"`
}
