import React from "react";

interface ToggleProps {
    on: boolean;
    options: string[];
    action: React.MouseEventHandler;
}

const Toggle: React.FC<any> = (props: ToggleProps) => {
    return (
        <div
            className={`rounded-sm h-fit w-[48px] p-1 text-sm gap-1 flex items-center justify-between cursor-pointer transition ${
                props.on ? "bg-green-600" : "bg-green-500"
            }`}
            onClick={props.action}
        >
            <div
                className={`transition duration-75 bg-neutral-100 rounded-sm w-4 h-4 ${
                    props.on && "translate-x-6"
                }`}
            ></div>
            <p
                className={`text-neutral-100 duration-75 leading-none flex-grow text-center ${
                    props.on && "-translate-x-5"
                }`}
            >
                {props.on ? props.options[1] : props.options[0]}
            </p>
        </div>
    );
};

export default Toggle;
