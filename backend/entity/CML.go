package entity

import (
	"gorm.io/gorm"
)

type CML struct {
	gorm.Model
	CmlNumber             uint    `json:"cml_number"`
	CmlDescription        string  `json:"cml_description"`
	ActualOutsideDiameter float64 `json:"actual_outside_diameter"`
	DesignThickness       float64 `json:"design_thickness"`
	StructuralThickness   float64 `json:"structural_thickness"`
	RequiredThickness     float64 `json:"required_thickness"`

	InfoID uint  `valid:"required~InfoID is required"`
	Info   *Info `gorm:"foreignKey:InfoID" valid:"-"`

	TestPoint []TestPoint `gorm:"foreignKey:CMLID" valid:"-"`
}
