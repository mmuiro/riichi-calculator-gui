import React, { useEffect, useState } from "react";
import { ScorePanel } from "./components/ScorePanel";
import { TileProps } from "./components/Tile";
import { TileButton, TileButtonProps } from "./components/TileButton";
import { SelectGroup, SelectGroupProps } from "./components/SelectGroup";
import Sidebar from "./components/Sidebar";
import ConditionsPanel from "./components/ConditionsPanel";
import Button from "./components/Button";
import TileInputPanel from "./components/TileInputPanel";
import DoraHolder from "./components/DoraHolder";
import { CalculateScore, CalculateWaits } from "../wailsjs/go/main/Calculator";
import { main } from "../wailsjs/go/models";
import ConditionsOptions from "./utils/ConditionsOptions";
import Toggle from "./components/Toggle";

interface Call {
    type: string;
    open: boolean;
    tiles: TileButtonProps[];
}

const generateDefaultTiles = (): TileButtonProps[] => {
    let ret: TileButtonProps[] = [];
    for (let i = 0; i < 14; i++) {
        ret.push({ empty: true, action: () => {} });
    }
    return ret;
};

const generateDefaultDoraIndicators = (): TileButtonProps[] => {
    let ret: TileButtonProps[] = [];
    ret.push({ empty: true, action: () => {} });
    for (let i = 0; i < 4; i++) {
        ret.push({
            empty: true,
            flipped: true,
            action: () => {},
        });
    }
    return ret;
};

const generateDefaultTileStock = (): number[][] => {
    let ret: number[][] = [];
    let rowLengths = [9, 9, 9, 7];
    let tileID = 0;
    for (let length of rowLengths) {
        for (let j = 0; j < length; j++) {
            if (j == 4 && tileID != 31) {
                ret.push([3]);
                ret[tileID].push(1);
            } else {
                ret.push([4]);
            }
            tileID++;
        }
    }
    return ret;
};

const parseDoraAndConditions = (
    doraIndicators: TileProps[],
    uraDoraIndicators: TileProps[],
    conds: { [k: string]: SelectGroupProps },
    calls: Call[]
): main.Conditions => {
    let dora: number[] = [];
    let uradora: number[] = [];
    let parsedConds: { [k: string]: any } = {};
    for (let tile of doraIndicators) {
        if (tile.empty || tile.flipped) continue;
        if (tile.tileID! > 30) {
            dora.push(((tile.tileID! - 30) % 3) + 31);
        } else if (tile.tileID! > 26) {
            dora.push(((tile.tileID! - 26) % 4) + 27);
        } else {
            let suit = Math.trunc(tile.tileID! / 9);
            dora.push(suit * 9 + ((tile.tileID! + 1) % 9));
        }
    }
    for (let tile of uraDoraIndicators) {
        if (tile.empty || tile.flipped) continue;
        if (tile.tileID! > 30) {
            uradora.push(((tile.tileID! - 30) % 3) + 31);
        } else if (tile.tileID! > 26) {
            uradora.push(((tile.tileID! - 26) % 4) + 27);
        } else {
            let suit = Math.trunc(tile.tileID! / 9);
            uradora.push(suit * 9 + ((tile.tileID! + 1) % 9));
        }
    }
    parsedConds.dora = dora;
    parsedConds.uradora = uradora;
    parsedConds.tsumo = conds["agari"].selected == 0;
    if (conds["riichi"].selected == 1) parsedConds.riichi = true;
    else if (conds["riichi"].selected == 2) parsedConds.doubleriichi = true;
    parsedConds.ippatsu = conds["ippatsu"].selected == 1;
    parsedConds.menzenchin =
        calls.filter((v: Call): boolean => v.open).length == 0;
    parsedConds[parsedConds.tsumo ? "haitei" : "houtei"] =
        conds["houtei_haitei"].selected == 1;
    parsedConds[parsedConds.tsumo ? "rinshan" : "chankan"] =
        conds["rinshan_chankan"].selected == 1;
    parsedConds.bakaze = conds["roundWind"].selected + 3;
    parsedConds.jikaze = conds["seatWind"].selected + 3;
    parsedConds[
        parsedConds.bakaze == parsedConds.jikaze ? "tenhou" : "chiihou"
    ] = conds["blessings"].selected == 1;
    return new main.Conditions(parsedConds);
};

const generateDefaultConditions = (
    language: number
): { [k: string]: SelectGroupProps } => {
    let ret: { [k: string]: SelectGroupProps } = {
        roundWind: {
            options: [...ConditionsOptions["roundWind"][language]],
            selected: 0,
            actions: [],
        },
        seatWind: {
            options: [...ConditionsOptions["seatWind"][language]],
            selected: 0,
            actions: [],
        },
        riichi: {
            options: [...ConditionsOptions["riichi"][language]],
            selected: 0,
            actions: [],
            size: "lg",
        },
        agari: {
            options: [...ConditionsOptions["agari"][language]],
            selected: 0,
            actions: [],
        },
        ippatsu: {
            options: [...ConditionsOptions["ippatsu"][language]],
            selected: 0,
            actions: [],
        },
        rinshan_chankan: {
            options: [...ConditionsOptions["rinshan_chankan"][language]],
            selected: 0,
            actions: [],
        },
        houtei_haitei: {
            options: [...ConditionsOptions["houtei_haitei"][language]],
            selected: 0,
            actions: [],
        },
        blessings: {
            options: [...ConditionsOptions["blessings"][language]],
            selected: 0,
            actions: [],
        },
    };
    return ret;
};

const Calculator: React.FC<any> = () => {
    // indices in the dora holders and the hand tiles for the selected tile
    let [selectedTiles, setSelectedTiles] = useState([0, 0, 0]);
    // indicates which of the hand tiles, dora, and uradora has the selected tile
    let [selectedTilePlace, setSelectedTilePlace] = useState(0);
    let [tilePlaces, setTilePlaces] = useState<TileButtonProps[][]>([
        generateDefaultTiles(),
        generateDefaultDoraIndicators(),
        generateDefaultDoraIndicators(),
    ]);
    let [tileStock, setTileStock] = useState<number[][]>(
        generateDefaultTileStock()
    );
    let [handTiles, doraIndicators, uraDoraIndicators] = tilePlaces;
    let [language, setLanguage] = useState<number>(1);
    let [conditions, setConditions] = useState<{
        [k: string]: SelectGroupProps;
    }>(generateDefaultConditions(language));
    let [calls, setCalls] = useState<Call[]>([]);
    let [tileAction, setTileAction] = useState(0);
    let [score, setScore] = useState<main.Score>();
    let [showScore, setShowScore] = useState<boolean>(false);
    let [waits, setWaits] = useState<TileProps[]>();

    const tileComparer = (a: TileProps, b: TileProps): number => {
        if (!(a.empty || b.empty)) {
            return a.tileID! - b.tileID!;
        }
        return a.empty ? 1 : -1;
    };

    const reset = () => {
        setSelectedTiles([0, 0, 0]);
        setSelectedTilePlace(0);
        setTileAction(0);
        setCalls([]);
        setConditions(generateDefaultConditions(language));
        setTilePlaces([
            generateDefaultTiles(),
            generateDefaultDoraIndicators(),
            generateDefaultDoraIndicators(),
        ]);
        setTileStock(generateDefaultTileStock());
    };

    const generateHandleAddTile = (
        tileID: number,
        red: boolean = false
    ): React.MouseEventHandler => {
        const handleAddTile = (e: React.MouseEvent) => {
            let tilePlace = tilePlaces[selectedTilePlace];
            let selectedTile = selectedTiles[selectedTilePlace];
            if (selectedTile < tilePlace.length) {
                tilePlace[selectedTile].tileID = tileID;
                tilePlace[selectedTile].red = red;
                tilePlace[selectedTile].empty = false;
                if (selectedTile < tilePlace.length - 1) {
                    tilePlace[selectedTile + 1].flipped = false;
                    tilePlace[selectedTile + 1].empty = true;
                }
                selectedTiles[selectedTilePlace]++;
                setSelectedTiles([...selectedTiles]);
                if (selectedTilePlace == 0) {
                    let index = tilePlace.findIndex(
                        (tprops: TileProps) => tprops.isLast
                    );
                    if (index > -1) tilePlace[index].isLast = false;
                    tilePlace[selectedTile].isLast = true;
                    tilePlace.sort(tileComparer);
                }
                setTilePlaces([...tilePlaces]);
                if (red) tileStock[tileID][1]--;
                else tileStock[tileID][0]--;
                setTileStock([...tileStock]);
            }
        };
        return handleAddTile;
    };

    const generateHandleRemoveTile = (
        tilePlaceNo: number,
        index: number
    ): React.MouseEventHandler => {
        const handleRemoveTile = (e: React.MouseEvent) => {
            let tilePlace = tilePlaces[tilePlaceNo];
            let targetTile = tilePlace[index];
            setSelectedTilePlace(tilePlaceNo);
            setTileAction(0);
            if (!targetTile.empty && !targetTile.flipped) {
                let [tileID, red] = [targetTile.tileID!, targetTile.red];
                tilePlaces[tilePlaceNo] = [
                    ...tilePlace.slice(0, index),
                    ...tilePlace.slice(index + 1),
                ];
                let lastTile: TileButtonProps = {
                    empty: true,
                    action: (e: React.MouseEvent) => {},
                };
                if (
                    tilePlaceNo > 0 &&
                    !(
                        selectedTiles[tilePlaceNo] ==
                        tilePlaces[tilePlaceNo].length + 1
                    )
                ) {
                    lastTile.flipped = true;
                }
                tilePlaces[tilePlaceNo].push(lastTile);
                selectedTiles[tilePlaceNo]--;
                setSelectedTiles([...selectedTiles]);
                setTilePlaces([...tilePlaces]);
                if (red) tileStock[tileID][1]++;
                else tileStock[tileID][0]++;
                setTileStock([...tileStock]);
            }
        };
        return handleRemoveTile;
    };

    const generateHandleSetCondition = (
        key: string,
        selected: number
    ): React.MouseEventHandler => {
        const handleSetCondition = (e: React.MouseEvent) => {
            conditions[key].selected = selected;
            setConditions({ ...conditions });
        };
        return handleSetCondition;
    };

    const generateHandleSetConditions = (
        key: string
    ): React.MouseEventHandler[] => {
        let ret: React.MouseEventHandler[] = [];
        for (let i = 0; i < conditions[key].options.length; i++) {
            ret.push(generateHandleSetCondition(key, i));
        }
        return ret;
    };

    const generateHandleSwitchAction = (
        actionNumber: number
    ): React.MouseEventHandler => {
        let handleSwitchAction = (e: React.MouseEvent) => {
            if (actionNumber == tileAction) setTileAction(0);
            else {
                setTileAction(actionNumber);
                setSelectedTilePlace(0);
            }
        };
        return handleSwitchAction;
    };

    const generateCreateChii = (
        tileID: number,
        red: boolean
    ): React.MouseEventHandler => {
        const createChii = (e: React.MouseEvent) => {
            let chiiTiles: TileButtonProps[] = [];
            for (let i = 0; i < 3; i++) {
                if ([4, 13, 22].includes(tileID) && red) {
                    chiiTiles.push({ tileID, red, action: () => {} });
                    tileStock[tileID][1]--;
                } else {
                    chiiTiles.push({ tileID, action: () => {} });
                    tileStock[tileID][0]--;
                }
                tileID++;
            }
            calls.push({ type: "chii", open: true, tiles: chiiTiles });
            tilePlaces[0] = tilePlaces[0].slice(0, tilePlaces[0].length - 3);
            setTilePlaces([...tilePlaces]);
            setCalls([...calls]);
            setTileAction(0);
            setTileStock([...tileStock]);
        };
        return createChii;
    };

    const generateCreatePon = (
        tileID: number,
        red: boolean
    ): React.MouseEventHandler => {
        const createPon = (e: React.MouseEvent) => {
            let ponTiles = [
                { tileID, red, action: () => {} },
                { tileID, action: () => {} },
                { tileID, action: () => {} },
            ];
            tileStock[tileID][red ? 1 : 0]--;
            tileStock[tileID][0] -= 2;
            calls.push({ type: "pon", open: true, tiles: ponTiles });
            tilePlaces[0] = tilePlaces[0].slice(0, tilePlaces[0].length - 3);
            setTilePlaces([...tilePlaces]);
            setCalls([...calls]);
            setTileAction(0);
            setTileStock([...tileStock]);
        };
        return createPon;
    };

    const generateCreateKan = (
        tileID: number,
        open: boolean
    ): React.MouseEventHandler => {
        const createKan = (e: React.MouseEvent) => {
            let kanTiles: TileButtonProps[] = [
                { tileID, action: () => {} },
                { tileID, action: () => {} },
                { tileID, action: () => {} },
            ];
            tileStock[tileID][0] -= 3;
            if ([4, 13, 22].includes(tileID)) {
                kanTiles.push({ tileID, red: true, action: () => {} });
                tileStock[tileID][1]--;
            } else {
                kanTiles.push({ tileID, action: () => {} });
                tileStock[tileID][0]--;
            }
            if (!open) {
                kanTiles[0].flipped = true;
                kanTiles[3].flipped = true;
            }
            calls.push({ type: "kan", open, tiles: kanTiles });
            tilePlaces[0] = tilePlaces[0].slice(0, tilePlaces[0].length - 3);
            setTilePlaces([...tilePlaces]);
            setCalls([...calls]);
            setTileAction(0);
            setTileStock([...tileStock]);
        };
        return createKan;
    };

    const generateTileAction = (tileID: number, red: boolean = false) => {
        switch (tileAction) {
            case 5:
                return generateCreateKan(tileID, false);
            case 4:
                return generateCreateKan(tileID, true);
            case 3:
                return generateCreatePon(tileID, red);
            case 2:
                return generateCreateChii(tileID, true);
            case 1:
                return generateCreateChii(tileID, red);
            default:
                return generateHandleAddTile(tileID, red);
        }
    };

    const generateHandleRemoveCall = (
        callIndex: number
    ): React.MouseEventHandler => {
        const handleRemoveCall = (e: React.MouseEvent) => {
            for (let tile of calls[callIndex].tiles) {
                tileStock[tile.tileID!][tile.red ? 1 : 0]++;
            }
            calls = [
                ...calls.slice(0, callIndex),
                ...calls.slice(callIndex + 1),
            ];
            tilePlaces[0].push(
                { empty: true, action: () => {} },
                { empty: true, action: () => {} },
                { empty: true, action: () => {} }
            );
            setTilePlaces([...tilePlaces]);
            setTileStock([...tileStock]);
            setCalls([...calls]);
        };
        return handleRemoveCall;
    };

    const updateConditionsOptions = () => {
        for (let key in conditions) {
            conditions[key].options = [...ConditionsOptions[key][language]];
        }
        if (conditions["agari"].selected == 0) {
            conditions["rinshan_chankan"].options[1] =
                language == 0 ? "After" : "嶺上開花";
            conditions["houtei_haitei"].options[1] =
                language == 0 ? "Sea" : "海底";
        } else {
            conditions["rinshan_chankan"].options[1] =
                language == 0 ? "Rob" : "槍槓";
            conditions["houtei_haitei"].options[1] =
                language == 0 ? "River" : "河底";
        }
        conditions["blessings"].options[1] =
            conditions["roundWind"].selected == conditions["seatWind"].selected
                ? language == 0
                    ? "Heaven's"
                    : "天和"
                : language == 0
                ? "Earth's"
                : "地和";
        if (
            (calls.filter((call) => call.type == "kan").length == 0 &&
                conditions["agari"].selected == 0) ||
            conditions["blessings"].selected == 1
        ) {
            conditions["rinshan_chankan"].disabled = true;
            conditions["rinshan_chankan"].selected = 0;
        } else conditions["rinshan_chankan"].disabled = false;
        if (
            calls.filter((call) => call.open).length > 0 ||
            conditions["blessings"].selected == 1
        ) {
            conditions["riichi"].disabled = true;
            conditions["riichi"].selected = 0;
            conditions["ippatsu"].disabled = true;
            conditions["ippatsu"].selected = 0;
        } else {
            conditions["riichi"].disabled = false;
            conditions["ippatsu"].disabled = false;
        }
        if (calls.length > 0) {
            conditions["blessings"].disabled = true;
            conditions["blessings"].selected = 0;
        } else conditions["blessings"].disabled = false;
        if (
            conditions["riichi"].selected == 0 &&
            conditions["ippatsu"].selected == 1
        )
            conditions["riichi"].selected = 1;
        if (conditions["blessings"].selected == 1) {
            conditions["agari"].disabled = true;
            conditions["agari"].selected = 0;
            conditions["houtei_haitei"].disabled = true;
            conditions["houtei_haitei"].selected = 0;
        } else {
            conditions["agari"].disabled = false;
            conditions["houtei_haitei"].disabled = false;
        }
    };

    updateConditionsOptions();

    const checkTileButtonDisabled = (
        tileID: number,
        red: boolean = false
    ): boolean => {
        let cond1 =
            tileStock[tileID][red ? 1 : 0] <= 0 ||
            selectedTiles[selectedTilePlace] >=
                tilePlaces[selectedTilePlace].length;
        let cond2 = tileAction == 1 || tileAction == 2;
        let ok = true;
        if (tileAction == 2) ok &&= tileID % 9 < 5 && tileID % 9 > 1;
        for (let i = 0; i < 3; i++) {
            if ([4, 13, 22].includes(tileID + i) && (red || tileAction == 2))
                ok &&= tileStock[tileID + i][1] > 0;
            else
                ok &&=
                    tileID + i < 27 &&
                    (tileID % 9) + i < 9 &&
                    tileStock[tileID + i][0] > 0;
        }
        cond2 = cond2 && !ok;
        let cond3 = tileAction == 3;
        cond3 &&= tileStock[tileID][0] + (red ? tileStock[tileID][1] : 0) < 3;
        let cond4 =
            tileAction > 3 &&
            tileStock[tileID][0] +
                ([4, 13, 22].includes(tileID) ? tileStock[tileID][1] : 0) <
                4;
        return cond1 || cond2 || cond3 || cond4;
    };

    let tileInputPanelRows: TileButtonProps[][] = [];
    let rowLengths = [9, 9, 9, 7];
    let tileID = 0;
    for (let length of rowLengths) {
        let row: TileButtonProps[] = [];
        for (let j = 0; j < length; j++) {
            row.push({
                tileID,
                action: generateTileAction(tileID),
                disabled: checkTileButtonDisabled(tileID),
            });
            if (j == 4 && tileID != 31)
                row.push({
                    tileID,
                    action: generateTileAction(tileID, true),
                    red: true,
                    disabled: checkTileButtonDisabled(tileID, true),
                });
            tileID++;
        }
        tileInputPanelRows.push(row);
    }

    const handToString = (handTiles: TileProps[], calls: Call[]): string => {
        let tiles = handTiles;
        // put the lastTile at the end
        if (selectedTiles[0] == tilePlaces[0].length) {
            let lastIndex = handTiles.findIndex(
                (tprops: TileProps) => tprops.isLast
            );
            tiles = [
                ...handTiles.slice(0, lastIndex),
                ...handTiles.slice(lastIndex + 1),
                handTiles[lastIndex],
            ];
        }
        // create the string
        let suits = ["m", "s", "p", "z"];
        let [ret, prevSuit] = ["", -1];
        for (let tile of tiles) {
            if (!tile.empty) {
                let suit = Math.trunc(tile.tileID! / 9);
                if (suit != prevSuit && prevSuit > -1) {
                    ret += suits[prevSuit];
                }
                prevSuit = suit;
                ret += tile.red ? "0" : 1 + (tile.tileID! % 9);
            }
        }
        ret += suits[prevSuit];
        for (let call of calls) {
            ret += " ";
            for (let tile of call.tiles) {
                ret += tile.red ? "0" : 1 + (tile.tileID! % 9);
            }
            ret +=
                (call.open ? "" : "c") +
                suits[Math.trunc(call.tiles[0].tileID! / 9)];
        }
        return ret;
    };

    const calculateScore = () => {
        let handString = handToString(handTiles, calls);
        let parsedConds = parseDoraAndConditions(
            doraIndicators,
            uraDoraIndicators,
            conditions,
            calls
        );
        CalculateScore(handString, parsedConds, language).then((result) =>
            setScore(result)
        );
    };

    const calculateWaits = () => {
        let handString = handToString(handTiles, calls);
        let waitTiles: TileProps[] = [];
        CalculateWaits(handString).then((result) => {
            console.log(result);
            for (let tile of result)
                waitTiles.push({ tileID: tile.tileID, red: tile.red });
            if (waitTiles.length > 0) {
                setWaits(waitTiles);
            }
        });
    };

    useEffect(() => {
        if (selectedTiles[0] == tilePlaces[0].length - 1) calculateWaits();
        else setWaits(undefined);
    }, [tilePlaces]);

    useEffect(() => {
        if (selectedTiles[0] == tilePlaces[0].length) {
            calculateScore();
        } else if (showScore) {
            setShowScore(false);
            setScore(undefined);
        }
    }, [conditions, tilePlaces, showScore]);

    useEffect(() => {
        if (score && !showScore) {
            setShowScore(true);
        }
    }, [score, showScore]);

    return (
        <div className="flex h-[100vh] w-[100vw]">
            <Sidebar />
            <div className="p-3 flex flex-grow space-x-3">
                <ConditionsPanel>
                    <div className="flex justify-between">
                        <div className="space-y-1">
                            <p>
                                {language == 0 ? "Dora Indicators" : "ドラ表示"}
                            </p>
                            <DoraHolder>
                                {doraIndicators.map((tprops, i) => (
                                    <TileButton
                                        key={i}
                                        {...tprops}
                                        selected={
                                            selectedTilePlace == 1 &&
                                            selectedTiles[1] == i
                                        }
                                        action={generateHandleRemoveTile(1, i)}
                                    />
                                ))}
                            </DoraHolder>
                        </div>
                        <Toggle
                            on={language == 1}
                            options={["EN", "JA"]}
                            action={() => setLanguage((language + 1) % 2)}
                        />
                    </div>

                    <div className="space-y-1">
                        <p>
                            {language == 0
                                ? "Ura Dora Indicators"
                                : "裏ドラ表示"}
                        </p>
                        <DoraHolder>
                            {uraDoraIndicators.map((tprops, i) => (
                                <TileButton
                                    key={i}
                                    {...tprops}
                                    selected={
                                        selectedTilePlace == 2 &&
                                        selectedTiles[2] == i
                                    }
                                    action={generateHandleRemoveTile(2, i)}
                                />
                            ))}
                        </DoraHolder>
                    </div>
                    <div className="flex justify-between ">
                        <div className="space-y-1">
                            <p>{language == 0 ? "Round Wind" : "場風"}</p>
                            <SelectGroup
                                {...conditions["roundWind"]}
                                actions={generateHandleSetConditions(
                                    "roundWind"
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <p>{language == 0 ? "Seat Wind" : "自風"}</p>
                            <SelectGroup
                                {...conditions["seatWind"]}
                                actions={generateHandleSetConditions(
                                    "seatWind"
                                )}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p>{language == 0 ? "Riichi" : "立直"}</p>
                        <SelectGroup
                            {...conditions["riichi"]}
                            actions={generateHandleSetConditions("riichi")}
                        />
                    </div>
                    <div className="flex justify-between">
                        <div className="space-y-1">
                            <p>{language == 0 ? "Tsumo/Ron" : "和了"}</p>
                            <SelectGroup
                                {...conditions["agari"]}
                                actions={generateHandleSetConditions("agari")}
                            />
                        </div>
                        <div className="space-y-1">
                            <p>{language == 0 ? "Ippatsu" : "一発"}</p>
                            <SelectGroup
                                {...conditions["ippatsu"]}
                                actions={generateHandleSetConditions("ippatsu")}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="space-y-1">
                            <p>
                                {language == 0
                                    ? "After/Robbing a Kan"
                                    : "嶺上開花・搶槓"}
                            </p>
                            <SelectGroup
                                {...conditions["rinshan_chankan"]}
                                actions={generateHandleSetConditions(
                                    "rinshan_chankan"
                                )}
                            />
                        </div>
                        <div className="space-y-1">
                            <p>
                                {language == 0
                                    ? "Under the River/Sea"
                                    : "河底・海底"}
                            </p>
                            <SelectGroup
                                {...conditions["houtei_haitei"]}
                                actions={generateHandleSetConditions(
                                    "houtei_haitei"
                                )}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p>
                            {language == 0
                                ? "Heaven's/Earth's Blessing"
                                : "天和・地和"}
                        </p>
                        <SelectGroup
                            {...conditions["blessings"]}
                            actions={generateHandleSetConditions("blessings")}
                        />
                    </div>
                    <div className="flex justify-center items-center flex-grow">
                        <Button
                            text={language == 0 ? "Reset All" : "入力を消す"}
                            action={reset}
                            large
                        />
                    </div>
                </ConditionsPanel>
                <div className="flex flex-grow flex-col space-y-2 px-0 items-center justify-between">
                    <ScorePanel
                        ready={showScore}
                        score={score}
                        waits={waits}
                        language={language}
                    />
                    <div className="flex justify-start items-center flex-wrap w-[404px] h-[88px] gap-2">
                        <div
                            className={`flex justify-center space-x-[2px] ${
                                calls.length > 0 ? "mr-2" : ""
                            }`}
                        >
                            {handTiles.map((tprops, i) => (
                                <TileButton
                                    key={i}
                                    {...tprops}
                                    selected={
                                        selectedTilePlace == 0 &&
                                        selectedTiles[0] == i
                                    }
                                    action={generateHandleRemoveTile(0, i)}
                                />
                            ))}
                        </div>
                        {calls.map((group, i) => (
                            <div key={i} className="flex space-x-[2px]">
                                {group.tiles.map((tbprops, j) => (
                                    <TileButton
                                        key={i + "," + j}
                                        {...tbprops}
                                        action={generateHandleRemoveCall(i)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <TileInputPanel rows={tileInputPanelRows}>
                            <div className="flex w-full space-x-2 mb-2 justify-evenly">
                                <Button
                                    text={language == 0 ? "Chii" : "チー"}
                                    action={generateHandleSwitchAction(1)}
                                    selected={tileAction == 1}
                                    disabled={
                                        tilePlaces[0].length -
                                            selectedTiles[0] <
                                        4
                                    }
                                />
                                <Button
                                    text={
                                        language == 0 ? "Chii(Red)" : "チー(赤)"
                                    }
                                    action={generateHandleSwitchAction(2)}
                                    selected={tileAction == 2}
                                    disabled={
                                        tilePlaces[0].length -
                                            selectedTiles[0] <
                                        4
                                    }
                                />
                                <Button
                                    text={language == 0 ? "Pon" : "ポン"}
                                    action={generateHandleSwitchAction(3)}
                                    selected={tileAction == 3}
                                    disabled={
                                        tilePlaces[0].length -
                                            selectedTiles[0] <
                                        4
                                    }
                                />
                                <Button
                                    text={language == 0 ? "Kan" : "明槓"}
                                    action={generateHandleSwitchAction(4)}
                                    selected={tileAction == 4}
                                    disabled={
                                        tilePlaces[0].length -
                                            selectedTiles[0] <
                                        4
                                    }
                                />
                                <Button
                                    text={language == 0 ? "Closed Kan" : "暗槓"}
                                    action={generateHandleSwitchAction(5)}
                                    selected={tileAction == 5}
                                    disabled={
                                        tilePlaces[0].length -
                                            selectedTiles[0] <
                                        4
                                    }
                                />
                            </div>
                        </TileInputPanel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
