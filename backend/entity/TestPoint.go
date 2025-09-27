package entity

import (
	"gorm.io/gorm"
)

type TestPoint struct {
	gorm.Model
	TpNumber      uint   `json:"tp_number"`
	TpDescription uint   `json:"tp_description"`
	Note          string `json:"note"`
	
	CMLID uint      `valid:"required~CMLID is required"`
	CML   *CML `gorm:"foreignKey:CMLID" valid:"-"`

	Thickness []Thickness `gorm:"foreignKey:TestPointID" valid:"-"`
}
