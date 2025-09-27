package config

import (
	"fmt"
	"math"
	"time"

	"example.com/TOUCHTHANAWAT/entity"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("dexon.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

type PipeSizeOD struct {
	PipeSize              float64
	ActualOutsideDiameter float64
}

var pipeSizes = []PipeSizeOD{
	{0.125, 10.3},
	{0.25, 13.7},
	{0.357, 17.1},
	{0.5, 21.3},
	{0.75, 26.7},
	{1.0, 33.4},
	{1.25, 42.2},
	{1.5, 48.3},
	{2.0, 60.3},
	{2.5, 73.0},
	{3.0, 88.9},
	{3.5, 101.6},
	{4.0, 114.3},
	{5.0, 141.3},
	{6.0, 168.3},
	{8.0, 219.1},
	{10.0, 273.0},
	{12.0, 323.8},
	{14.0, 355.6},
	{16.0, 406.4},
	{18.0, 457.0},
}

func FindOD(pipeSize float64) float64 {
	for _, p := range pipeSizes {
		if p.PipeSize == pipeSize {
			return p.ActualOutsideDiameter
		}
	}
	return 0
}
func GetStructuralThickness(pipeSize float64) float64 {
	if pipeSize <= 2 {
		return 1.8
	} else if pipeSize == 3 {
		return 2.0
	} else if pipeSize == 4 {
		return 2.3
	} else if pipeSize >= 6 && pipeSize <= 18 {
		return 2.8
	} else if pipeSize >= 20 {
		return 3.1
	} else {
		return 0
	}
}

func CalculateDesignThickness(designPressure, actualOD, stress, jointEfficiency float64) float64 {
	return (designPressure * actualOD) / ((2 * stress * jointEfficiency) + (2 * designPressure * 0.4))
}

func SetupDatabase() {
	db.AutoMigrate(
		&entity.User{},
		&entity.Info{},
		&entity.TestPoint{},
		&entity.Thickness{},
		&entity.CML{},
	)
	hashedPassword, _ := HashPassword("123456")
	User := &entity.User{
		Username: "Software",
		Password: hashedPassword,
	}
	db.FirstOrCreate(User, &entity.User{
		Username: "Software",
	})
	Info1 := entity.Info{
		LineNumber:           "6-PL-J4N-01007",
		Location:             "Dacon A",
		From:                 "BLACK STARTCOOLED WELL FLUID FROM MDPP",
		To:                   "TEST SEPARATOR,V-0111",
		DrawingNumber:        "MDA-D-B-26001-1-0-Rev00-2011",
		Service:              "PL",
		Material:             "Duplex Stainless Steel",
		InserviceDate:        time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
		PipeSize:             6.0,
		OriginalThickness:    7.1,
		Stress:               20000,
		JointEfficiency:      1,
		Ca:                   3,
		DesignLife:           25,
		DesignPressure:       1015,
		OperatingPressure:    327,
		DesignTemperature:    140,
		OperatingTemperature: 45,
	}
	Info2 := entity.Info{
		LineNumber:           "6-PL-J4N-01110",
		Location:             "Dacon B",
		From:                 "BLACK STARTCOOLED WELL FLUID FROM MDPP",
		To:                   "TEST SEPARATOR,V-0111",
		DrawingNumber:        "MDA-D-B-26001-1-0-Rev00-2011",
		Service:              "PL",
		Material:             "Duplex Stainless Steel",
		InserviceDate:        time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
		PipeSize:             6,
		OriginalThickness:    7.1,
		Stress:               20000,
		JointEfficiency:      1,
		Ca:                   3,
		DesignLife:           25,
		DesignPressure:       1015,
		OperatingPressure:    327,
		DesignTemperature:    140,
		OperatingTemperature: 45,
	}
	Info3 := entity.Info{
		LineNumber:           "3-GC-J4N-10017",
		Location:             "Dacon C",
		From:                 "BLACK STARTCOOLED WELL FLUID FROM MDPP",
		To:                   "TEST SEPARATOR,V-0111",
		DrawingNumber:        "B17-3-AMA-PR-005-0003",
		Service:              "GC",
		Material:             "Duplex Stainless Steel",
		InserviceDate:        time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
		PipeSize:             3,
		OriginalThickness:    5.48,
		Stress:               20000,
		JointEfficiency:      1,
		Ca:                   3,
		DesignLife:           25,
		DesignPressure:       1015,
		OperatingPressure:    623,
		DesignTemperature:    120,
		OperatingTemperature: 73.27,
	}
	Info4 := entity.Info{
		LineNumber:           "3-GC-J4N-10018",
		Location:             "Dacon A",
		From:                 "BLACK STARTCOOLED WELL FLUID FROM MDPP",
		To:                   "TEST SEPARATOR,V-0111",
		DrawingNumber:        "B17-3-AMA-PR-005-0003",
		Service:              "GC",
		Material:             "Duplex Stainless Steel",
		InserviceDate:        time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
		PipeSize:             3,
		OriginalThickness:    5.48,
		Stress:               20000,
		JointEfficiency:      1,
		Ca:                   3,
		DesignLife:           25,
		DesignPressure:       1015,
		OperatingPressure:    623,
		DesignTemperature:    120,
		OperatingTemperature: 73.27,
	}
	Info5 := entity.Info{
		LineNumber:           "2-GC-J4N-10034",
		Location:             "Dacon B",
		From:                 "BLACK STARTCOOLED WELL FLUID FROM MDPP",
		To:                   "TEST SEPARATOR,V-0111",
		DrawingNumber:        "B17-3-AMA-PR-005-0003",
		Service:              "GC",
		Material:             "Duplex Stainless Steel",
		InserviceDate:        time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC),
		PipeSize:             2,
		OriginalThickness:    3.91,
		Stress:               20000,
		JointEfficiency:      1,
		Ca:                   3,
		DesignLife:           25,
		DesignPressure:       1015,
		OperatingPressure:    623,
		DesignTemperature:    120,
		OperatingTemperature: 73.27,
	}
	db.FirstOrCreate(&Info1, &entity.Info{
		LineNumber: "6-PL-J4N-01007",
	})
	db.FirstOrCreate(&Info2, &entity.Info{
		LineNumber: "6-PL-J4N-01110",
	})
	db.FirstOrCreate(&Info3, &entity.Info{
		LineNumber: "3-GC-J4N-10017",
	})
	db.FirstOrCreate(&Info4, &entity.Info{
		LineNumber: "3-GC-J4N-10018",
	})
	db.FirstOrCreate(&Info5, &entity.Info{
		LineNumber: "2-GC-J4N-10034",
	})

	ActualOutsideDiameter1 := FindOD(Info1.PipeSize)
	StructuralThickness1 := GetStructuralThickness(Info1.PipeSize)
	DesignThickness1 := CalculateDesignThickness(float64(Info1.DesignPressure), ActualOutsideDiameter1, float64(Info1.Stress), float64(Info1.JointEfficiency))

	CML1 := entity.CML{
		CmlNumber:             1,
		CmlDescription:        "Pipe",
		ActualOutsideDiameter: ActualOutsideDiameter1,
		DesignThickness:       DesignThickness1,
		StructuralThickness:   StructuralThickness1,
		RequiredThickness:     math.Max(DesignThickness1, StructuralThickness1),
		InfoID:                Info1.ID,
	}
	db.FirstOrCreate(&CML1, entity.CML{CmlNumber: 1, InfoID: Info1.ID})
	CML2 := entity.CML{
		CmlNumber:             2,
		CmlDescription:        "Elbow i",
		ActualOutsideDiameter: ActualOutsideDiameter1,
		DesignThickness:       DesignThickness1,
		StructuralThickness:   StructuralThickness1,
		RequiredThickness:     math.Max(DesignThickness1, StructuralThickness1),
		InfoID:                Info1.ID,
	}
	db.FirstOrCreate(&CML2, entity.CML{CmlNumber: 2, InfoID: Info1.ID})
	CML3 := entity.CML{
		CmlNumber:             3,
		CmlDescription:        "Elbow ii",
		ActualOutsideDiameter: ActualOutsideDiameter1,
		DesignThickness:       DesignThickness1,
		StructuralThickness:   StructuralThickness1,
		RequiredThickness:     math.Max(DesignThickness1, StructuralThickness1),
		InfoID:                Info1.ID,
	}
	db.FirstOrCreate(&CML3, entity.CML{CmlNumber: 3, InfoID: Info1.ID})
	CML4 := entity.CML{
		CmlNumber:             4,
		CmlDescription:        "Pipe",
		ActualOutsideDiameter: ActualOutsideDiameter1,
		DesignThickness:       DesignThickness1,
		StructuralThickness:   StructuralThickness1,
		RequiredThickness:     math.Max(DesignThickness1, StructuralThickness1),
		InfoID:                Info1.ID,
	}
	db.FirstOrCreate(&CML4, entity.CML{CmlNumber: 4, InfoID: Info1.ID})
	CML5 := entity.CML{
		CmlNumber:             5,
		CmlDescription:        "Pipe",
		ActualOutsideDiameter: ActualOutsideDiameter1,
		DesignThickness:       DesignThickness1,
		StructuralThickness:   StructuralThickness1,
		RequiredThickness:     math.Max(DesignThickness1, StructuralThickness1),
		InfoID:                Info1.ID,
	}
	db.FirstOrCreate(&CML5, entity.CML{CmlNumber: 5, InfoID: Info1.ID})

	ActualOutsideDiameter2 := FindOD(Info2.PipeSize)
	StructuralThickness2 := GetStructuralThickness(Info2.PipeSize)
	DesignThickness2 := CalculateDesignThickness(float64(Info2.DesignPressure), ActualOutsideDiameter2, float64(Info2.Stress), float64(Info2.JointEfficiency))

	CML6 := entity.CML{
		CmlNumber:             1,
		CmlDescription:        "Pipe",
		ActualOutsideDiameter: ActualOutsideDiameter2,
		DesignThickness:       DesignThickness2,
		StructuralThickness:   StructuralThickness2,
		RequiredThickness:     math.Max(DesignThickness2, StructuralThickness2),
		InfoID:                Info2.ID,
	}
	db.FirstOrCreate(&CML6, entity.CML{CmlNumber: 1, InfoID: Info2.ID})
	CML7 := entity.CML{
		CmlNumber:             2,
		CmlDescription:        "Tee i",
		ActualOutsideDiameter: ActualOutsideDiameter2,
		DesignThickness:       DesignThickness2,
		StructuralThickness:   StructuralThickness2,
		RequiredThickness:     math.Max(DesignThickness2, StructuralThickness2),
		InfoID:                Info2.ID,
	}
	db.FirstOrCreate(&CML7, entity.CML{CmlNumber: 2, InfoID: Info2.ID})
	CML8 := entity.CML{
		CmlNumber:             3,
		CmlDescription:        "Tee iii",
		ActualOutsideDiameter: ActualOutsideDiameter2,
		DesignThickness:       DesignThickness2,
		StructuralThickness:   StructuralThickness2,
		RequiredThickness:     math.Max(DesignThickness2, StructuralThickness2),
		InfoID:                Info2.ID,
	}
	db.FirstOrCreate(&CML8, entity.CML{CmlNumber: 3, InfoID: Info2.ID})
	CML9 := entity.CML{
		CmlNumber:             4,
		CmlDescription:        "Pipe",
		ActualOutsideDiameter: ActualOutsideDiameter2,
		DesignThickness:       DesignThickness2,
		StructuralThickness:   StructuralThickness2,
		RequiredThickness:     math.Max(DesignThickness2, StructuralThickness2),
		InfoID:                Info2.ID,
	}
	db.FirstOrCreate(&CML9, entity.CML{CmlNumber: 4, InfoID: Info2.ID})

	testPoints := []entity.TestPoint{
		// Line 6-PL-J4N-01007
		{TpNumber: 1, TpDescription: 0, CMLID: CML1.ID},
		{TpNumber: 2, TpDescription: 90, CMLID: CML1.ID},
		{TpNumber: 3, TpDescription: 180, CMLID: CML1.ID},
		{TpNumber: 4, TpDescription: 270, CMLID: CML1.ID},

		{TpNumber: 1, TpDescription: 0, CMLID: CML2.ID},
		{TpNumber: 2, TpDescription: 90, CMLID: CML2.ID},
		{TpNumber: 3, TpDescription: 180, CMLID: CML2.ID},
		{TpNumber: 4, TpDescription: 270, CMLID: CML2.ID},

		{TpNumber: 1, TpDescription: 0, CMLID: CML3.ID},
		{TpNumber: 2, TpDescription: 90, CMLID: CML3.ID},
		{TpNumber: 3, TpDescription: 180, CMLID: CML3.ID},
		{TpNumber: 4, TpDescription: 270, CMLID: CML3.ID},

		{TpNumber: 1, TpDescription: 0, CMLID: CML4.ID},
		{TpNumber: 2, TpDescription: 90, CMLID: CML4.ID},
		{TpNumber: 3, TpDescription: 180, CMLID: CML4.ID},
		{TpNumber: 4, TpDescription: 270, CMLID: CML4.ID},

		{TpNumber: 1, TpDescription: 0, CMLID: CML5.ID},
		{TpNumber: 2, TpDescription: 90, CMLID: CML5.ID},
		{TpNumber: 3, TpDescription: 180, CMLID: CML5.ID},
		{TpNumber: 4, TpDescription: 270, CMLID: CML5.ID},

		{TpNumber: 1, TpDescription: 0, CMLID: CML6.ID},
		{TpNumber: 2, TpDescription: 90, CMLID: CML6.ID},
		{TpNumber: 3, TpDescription: 180, CMLID: CML6.ID},
		{TpNumber: 4, TpDescription: 270, CMLID: CML6.ID},

		{TpNumber: 1, TpDescription: 0, CMLID: CML7.ID},
		{TpNumber: 2, TpDescription: 90, CMLID: CML7.ID},
		{TpNumber: 3, TpDescription: 180, CMLID: CML7.ID},
		{TpNumber: 4, TpDescription: 270, CMLID: CML7.ID},

		{TpNumber: 1, TpDescription: 0, CMLID: CML8.ID},
		{TpNumber: 2, TpDescription: 90, CMLID: CML8.ID},
		{TpNumber: 3, TpDescription: 180, CMLID: CML8.ID},
		{TpNumber: 4, TpDescription: 270, CMLID: CML8.ID},

		{TpNumber: 1, TpDescription: 0, CMLID: CML9.ID},
		{TpNumber: 2, TpDescription: 90, CMLID: CML9.ID},
		{TpNumber: 3, TpDescription: 180, CMLID: CML9.ID},
		{TpNumber: 4, TpDescription: 270, CMLID: CML9.ID},
	}

	for _, tp := range testPoints {
		db.FirstOrCreate(&tp, entity.TestPoint{TpNumber: tp.TpNumber, CMLID: tp.CMLID})
	}

	// โหลด TestPoints ทั้งหมดจาก DB
	var tps []entity.TestPoint
	db.Find(&tps)

	// ปีที่ต้องการ
	years := []string{"2021-01-01", "2022-01-01"}

	// ค่า Thickness (2 ปี → 1 TestPoint)
	thicknessValues := [][]string{
		{"6.5", "6.78"},
		{"6.99", "6.87"},
		{"6.63", "6.54"},
		{"6.77", "6.43"},
	}

	// ใส่ข้อมูล Thickness ให้ทุก TestPoint
	for _, tp := range tps {
		idx := int(tp.TpNumber-1) % len(thicknessValues)
		values := thicknessValues[idx]

		for yearIndex, year := range years {
			date, _ := time.Parse("2006-01-02", year)

			thickness := entity.Thickness{
				InspectionDate:  date,
				ActualThickness: values[yearIndex],
				TestPointID:     tp.ID,
			}

			// ป้องกันซ้ำ: ตรวจว่า TestPointID + InspectionDate มีอยู่แล้วหรือยัง
			db.Where(entity.Thickness{
				TestPointID:    tp.ID,
				InspectionDate: date,
			}).FirstOrCreate(&thickness)
		}
	}
}
