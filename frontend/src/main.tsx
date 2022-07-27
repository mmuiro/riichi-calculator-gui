import React from "react";
import { createRoot } from "react-dom/client";
import Calculator from "./Calculator";
import "./style.css";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <Calculator></Calculator>
    </React.StrictMode>
);
