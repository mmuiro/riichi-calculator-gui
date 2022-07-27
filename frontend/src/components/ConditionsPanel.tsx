import React from "react";
interface ConditionsPanelProps {
    children: React.ReactNode;
}

const ConditionsPanel: React.FC<any> = (props: ConditionsPanelProps) => {
    return (
        <div className="border-neutral-300 border-[2px] p-3 shadow-lg shadow-neutral-300 h-full w-[280px] rounded-lg bg-neutral-100 space-y-2 antialiased text-xs font-medium flex flex-col">
            {props.children}
        </div>
    );
};

export default ConditionsPanel;
