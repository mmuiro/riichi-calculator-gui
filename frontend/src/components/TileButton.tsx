import React from "react";
import { Tile, TileProps } from "./Tile";

interface TileButtonProps extends TileProps {
    action: React.MouseEventHandler;
    disabled?: boolean;
}

const TileButton: React.FC<any> = (props: TileButtonProps) => {
    return (
        <div
            onClick={(e: React.MouseEvent) => {
                if (!props.disabled) props.action(e);
            }}
            className={`relative ${props.disabled ? "cursor-not-allowed" : ""}`}
        >
            <Tile {...props} />
            {props.disabled && (
                <div className="opacity-50 bg-neutral-900 w-[27px] h-[40px] rounded-sm absolute top-0"></div>
            )}
        </div>
    );
};

export { TileButton, type TileButtonProps };
