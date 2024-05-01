import React from "react";
import { render } from "react-dom";
import Homepage from "./HomePage";

export default function App({ name }) {
    return (
        <>
            <Homepage name={name} />
        </>
    )
}

const appDiv = document.getElementById("app");
render(<App name="Harvy" />, appDiv);