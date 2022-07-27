import React from "react";
import Button from "./Button";
import { TileButton, TileButtonProps } from "./TileButton";

interface TileInputPanelProps {
    rows: TileButtonProps[][];
    children: React.ReactNode;
}

const TileInputPanel: React.FC<any> = (props: TileInputPanelProps) => {
    return (
        <div className="rounded-lg border-[2px] border-neutral-300 flex flex-col justify-center items-center px-4 py-4 space-y-1 bg-neutral-100 w-[404px]">
            {props.children}
            {props.rows.map((row, i) => (
                <div className="space-x-1 flex" key={i}>
                    {row.map((tbprops, j) => (
                        <TileButton {...tbprops} key={i + "," + j} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TileInputPanel;
