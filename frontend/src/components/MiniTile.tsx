import React from "react";
import TileImages from "../utils/TileImages";
import { TileProps } from "./Tile";

const MiniTile: React.FC<any> = (props: TileProps) => {
    return (
        <div className="w-[21px] h-[30px] rounded-sm bg-green-700 flex items-end">
            <div className="w-[21px] h-[29px] rounded-sm bg-zinc-400 flex items-end">
                <div className="w-[21px] h-[28px] rounded-sm bg-white overflow-hidden flex justify-center items-center">
                    <img
                        className="w-[18px] h-[24px]"
                        src={TileImages[props.tileID!][props.red ? 1 : 0]}
                    />
                </div>
            </div>
        </div>
    );
};

export { MiniTile };
