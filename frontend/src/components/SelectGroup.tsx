import React from "react";

interface SelectGroupProps {
    options: string[];
    selected: number;
    default?: number;
    disabled?: boolean;
    size?: string;
    actions: React.MouseEventHandler[];
}

const getSize = (size: string) => {
    if (size in sizeMap) return sizeMap[size];
    return sizeMap["sm"];
};

const sizeMap: { [k: string]: string } = {
    sm: "w-[120px]",
    md: "w-[168px]",
    lg: "w-[232]",
};

const SelectGroup: React.FC<any> = (props: SelectGroupProps) => {
    let [def, size] = [props.default || 0, props.size || "sm"];
    return (
        <div
            className={`rounded-sm ${getSize(
                size
            )} h-6 flex justify-evenly divide-x divide-green-300 ${
                props.disabled ? "opacity-50" : ""
            }`}
        >
            {props.options.map((v, i) => (
                <div
                    className={`h-full flex-grow flex justify-center items-center text-xs text-center ${
                        props.disabled ? "cursor-not-allowed" : "cursor-pointer"
                    } ${
                        i == props.selected
                            ? "text-white bg-green-600"
                            : "text-green-100 bg-green-500 transition"
                    } ${
                        !props.disabled && i != props.selected
                            ? "hover:bg-green-600"
                            : ""
                    } ${
                        !props.disabled
                            ? "ring-opacity-75 ring-emerald-400 active:ring"
                            : ""
                    } ${
                        i == 0
                            ? "rounded-l-sm"
                            : i == props.options.length - 1
                            ? "rounded-r-sm"
                            : ""
                    }`}
                    onClick={
                        !props.disabled && props.actions
                            ? props.actions[i]
                            : () => {}
                    }
                    key={i}
                >
                    {v}
                </div>
            ))}
        </div>
    );
};

export { SelectGroup, type SelectGroupProps };
