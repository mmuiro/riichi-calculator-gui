package main

import (
	calc "github.com/mmuiro/riichi-base/src/calculator"
	riichi "github.com/mmuiro/riichi-base/src/models"
	"github.com/mmuiro/riichi-base/src/models/constants/languages"
	lang "github.com/mmuiro/riichi-base/src/models/constants/languages"
	suits "github.com/mmuiro/riichi-base/src/models/constants/suits"
	yaku "github.com/mmuiro/riichi-base/src/models/yaku"
)

type Yaku struct {
	Han  int    `json:"han"`
	Name string `json:"name"`
}

type Yakuman struct {
	Value int    `json:"value"`
	Name  string `json:"name"`
}

type Score struct {
	YakuList          []Yaku    `json:"yakuList"`
	YakumanList       []Yakuman `json:"yakumanList"`
	YakumanMultiplier int       `json:"yakumanMultiplier"`
	Han               int       `json:"han"`
	Fu                int       `json:"fu"`
	Points            int       `json:"points"`
	ScoreLevel        string    `json:"scoreLevel"`
	TsumoSplit        []int     `json:"tsumoSplit"`
}

type Tile struct {
	TileID int  `json:"tileID"`
	Red    bool `json:"red"`
}

type Conditions struct {
	Tsumo        bool  `json:"tsumo"`
	Riichi       bool  `json:"riichi"`
	DoubleRiichi bool  `json:"doubleriichi"`
	Ippatsu      bool  `json:"ippatsu"`
	Menzenchin   bool  `json:"menzenchin"`
	Houtei       bool  `json:"houtei"`
	Haitei       bool  `json:"haitei"`
	Rinshan      bool  `json:"rinshan"`
	Chankan      bool  `json:"chankan"`
	Tenhou       bool  `json:"tenhou"`
	Chiihou      bool  `json:"chiihou"`
	Bakaze       int   `json:"bakaze"`
	Jikaze       int   `json:"jikaze"`
	Dora         []int `json:"dora"`
	UraDora      []int `json:"uradora"`
}

type Calculator struct{}

func (c *Calculator) CalculateScore(handString string, cond Conditions, l int) Score {
	cc := yaku.Conditions{
		Tsumo:        cond.Tsumo,
		Riichi:       cond.Riichi,
		DoubleRiichi: cond.DoubleRiichi,
		Ippatsu:      cond.Ippatsu,
		Menzenchin:   cond.Menzenchin,
		Houtei:       cond.Houtei,
		Haitei:       cond.Haitei,
		Rinshan:      cond.Rinshan,
		Chankan:      cond.Chankan,
		Tenhou:       cond.Tenhou,
		Chiihou:      cond.Chiihou,
		Bakaze:       suits.Suit(cond.Bakaze),
		Jikaze:       suits.Suit(cond.Jikaze),
		Dora:         cond.Dora,
		UraDora:      cond.UraDora,
	}
	hand, lastTile, err := riichi.StringToHand(handString)
	if err != nil {
		return Score{}
	}
	score, err := calc.CalculateScoreVerbose(hand, lastTile, &cc)
	if err != nil {
		return Score{}
	}
	var yakuList []Yaku
	for _, y := range score.YakuList {
		yakuList = append(yakuList, Yaku{Han: y.Han(!cc.Menzenchin), Name: y.Name(lang.Language(l))})
	}
	var yakumanList []Yakuman
	for _, y := range score.YakumanList {
		yakumanList = append(yakumanList, Yakuman{Value: y.Value(), Name: y.Name(lang.Language(l))})
	}
	return Score{
		Points:            score.Points,
		YakuList:          yakuList,
		YakumanList:       yakumanList,
		YakumanMultiplier: score.YakumanMultiplier,
		Han:               score.Han,
		Fu:                score.Fu,
		ScoreLevel:        score.ScoreLevelName(languages.Language(l)),
		TsumoSplit:        score.TsumoSplit,
	}
}

func (c *Calculator) CalculateWaits(handString string) []Tile {
	hand, _, err := riichi.StringToHand(handString)
	ret := make([]Tile, 0)
	if err != nil {
		return ret
	}
	for _, tileID := range calc.CalculateWaitTiles(hand) {
		ret = append(ret, Tile{TileID: tileID})
	}
	return ret
}
