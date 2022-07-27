import React from "react";
import TileImages from "../utils/TileImages";

interface TileProps {
    tileID?: number;
    flipped?: boolean;
    empty?: boolean;
    red?: boolean;
    selected?: boolean;
    isLast?: boolean;
}

const Tile: React.FC<any> = (props: TileProps) => {
    return props.flipped ? (
        <div className="w-[27px] h-[40px] rounded-sm bg-zinc-400  flex items-end ring-1 ring-green-800">
            <div className="w-[27px] h-[39px] rounded-sm flex bg-green-700 items-end">
                <div className="w-[27px] h-[36px] rounded-sm bg-green-600"></div>
            </div>
        </div>
    ) : props.empty ? (
        <div
            className={`w-[27px] h-[40px] rounded-sm  flex items-end ring-1   transition cursor-pointer ${
                props.selected
                    ? "animate-pulse ring-green-500 bg-green-300"
                    : "ring-neutral-400 bg-neutral-200 hover:bg-neutral-300"
            }`}
        ></div>
    ) : (
        <div className="w-[27px] h-[40px] rounded-sm bg-green-700 flex items-end ring-1  ring-neutral-400 cursor-pointer relative">
            <div className="w-[27px] h-[39px] rounded-sm bg-zinc-400 flex items-end">
                <div className="w-[27px] h-[36px] rounded-sm bg-white hover:bg-neutral-300 transition overflow-hidden flex justify-center items-center">
                    <img
                        className="w-[24px] h-[32px]"
                        src={TileImages[props.tileID!][props.red ? 1 : 0]}
                    />
                </div>
            </div>
            {props.isLast && (
                <div className="w-[27px] h-[40px] rounded-sm bg-red-700 opacity-40 top-0 absolute"></div>
            )}
        </div>
    );
};

export { Tile, type TileProps };
