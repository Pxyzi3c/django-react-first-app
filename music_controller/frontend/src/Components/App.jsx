import React from "react";
import { render } from "react-dom";
import Homepage from "./HomePage";

export default function App({ name }) {
    return (
        <div className="w-100 flex items-center justify-center">
            <Homepage name={name} />
        </div>
    )
}

const appDiv = document.getElementById("app");
render(<App name="Harvy" />, appDiv);