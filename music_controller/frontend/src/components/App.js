import React from "react";
import { render } from "react-dom";
import Homepage from "./HomePage";
import Navbar from "./Navbar";

export default function App({ name }) {
    return (
        <div className="w-100 flex items-center justify-center">
            <Navbar />
            <Homepage name={name} />
        </div>
    )
}

const appDiv = document.getElementById("app");
render(<App name="Harvy" />, appDiv);