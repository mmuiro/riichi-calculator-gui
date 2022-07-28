import React from "react";
import { main } from "../../wailsjs/go/models";
import { MiniTile } from "./MiniTile";
import { Tile, TileProps } from "./Tile";

interface ScorePanelProps {
    ready: boolean;
    score: main.Score;
    language: number;
    waits?: TileProps[];
}

const ScorePanel: React.FC<any> = (props: ScorePanelProps) => {
    let score = props.score;
    let tsumoSplit = score ? score.tsumoSplit : undefined;
    console.log(score);
    return (
        <div className="rounded-lg ring ring-neutral-300 mx-4 bg-neutral-800 w-[404px] h-32 text-white text-sm px-3 py-2 font-medium">
            {props.ready ? (
                (() => {
                    if (score.points == 0) {
                        return (
                            <p>
                                {props.language == 0
                                    ? "The hand has no yaku/is not complete."
                                    : "役がありません。"}
                            </p>
                        );
                    } else {
                        return (
                            <div className="flex flex-col divide-y-2 justify-between h-full w-full">
                                <div className="w-full h-full">
                                    <div className="grid grid-rows-5 grid-flow-col auto-rows-min auto-cols-max gap-x-8 h-full">
                                        {score.yakuList
                                            ? score.yakuList.map((yaku, i) => (
                                                  <div
                                                      className="text-xs w-fit h-fit"
                                                      key={i}
                                                  >{`${yaku.name} ${yaku.han}${
                                                      props.language == 0
                                                          ? " Han"
                                                          : "飜"
                                                  }`}</div>
                                              ))
                                            : score.yakumanList.map(
                                                  (yakuman, i) => (
                                                      <div
                                                          className="text-xs w-fit h-fit"
                                                          key={i}
                                                      >{`${yakuman.name}`}</div>
                                                  )
                                              )}
                                    </div>
                                </div>
                                <div className="flex justify-between text-base h-fit">
                                    {score.scoreLevel !== "" && (
                                        <p className="text-transparent bg-clip-text bg-gradient-to-t text-base from-yellow-400 to-red-500 leading-tight">
                                            {score.scoreLevel}
                                        </p>
                                    )}
                                    <p className="leading-tight text-sm">
                                        {props.language == 0
                                            ? (score.yakuList
                                                  ? `${score.han} Han ${score.fu} Fu `
                                                  : "") +
                                              `${score.points} Points ${
                                                  tsumoSplit
                                                      ? tsumoSplit.length == 2
                                                          ? `(${tsumoSplit[0]}/${tsumoSplit[1]})`
                                                          : `(${tsumoSplit[0]} all)`
                                                      : ""
                                              }`
                                            : (score.yakuList
                                                  ? `${score.han}飜 ${score.fu}符 `
                                                  : "") +
                                              `${score.points}点 ${
                                                  tsumoSplit
                                                      ? tsumoSplit.length == 2
                                                          ? `(${tsumoSplit[0]}/${tsumoSplit[1]})`
                                                          : `(${tsumoSplit[0]}オール)`
                                                      : ""
                                              }`}
                                    </p>
                                </div>
                            </div>
                        );
                    }
                })()
            ) : props.waits ? (
                <div className="flex flex-col divide-y-2">
                    <p className="text-base font-medium">
                        {props.language == 0 ? "Tenpai" : "聴牌"}
                    </p>
                    <div className="flex gap-2 pt-2 items-center flex-wrap">
                        <p>{props.language == 0 ? "Waits:" : "待ち："}</p>
                        {props.waits.map((tprops, i) => (
                            <MiniTile {...tprops} key={i} />
                        ))}
                    </div>
                </div>
            ) : (
                <p>
                    {props.language == 0
                        ? "Please enter a hand."
                        : "手配の入力を完成してください。"}
                </p>
            )}
        </div>
    );
};

export { ScorePanel };
