import React from "react";

interface ButtonProps {
    text: string;
    action: React.MouseEventHandler;
    disabled: boolean;
    selected?: boolean;
    large?: boolean;
}

const Button: React.FC<any> = (props: ButtonProps) => {
    return (
        <div
            className={`rounded-sm flex justify-center items-center px-4 ${
                props.large ? "text-sm font-semibold py-2" : "text-xs py-1"
            } ${
                props.selected && !props.disabled
                    ? "bg-green-600 cursor-pointer"
                    : "bg-green-500 " +
                      (props.disabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-green-600 active:ring cursor-pointer")
            } text-white ring-opacity-75 ring-emerald-400 transition`}
            onClick={(e: React.MouseEvent) => {
                if (!props.disabled) props.action(e);
            }}
        >
            {props.text}
        </div>
    );
};

export default Button;
