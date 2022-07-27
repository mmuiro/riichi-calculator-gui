import React from "react";

interface DoraHolderProps {
    children: React.ReactNode;
}

const DoraHolder: React.FC<any> = (props: DoraHolderProps) => {
    return (
        <div className="flex w-fit rounded-sm overflow-hidden ring-2 ring-emerald-800 space-x-[1px]">
            {props.children}
        </div>
    );
};

export default DoraHolder;
