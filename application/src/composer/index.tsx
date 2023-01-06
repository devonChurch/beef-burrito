import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

console.log("> composer");
document.body.innerHTML = "<main />";
const element = document.querySelector("main") as HTMLElement;

const root = createRoot(element);
root.render(<App />);
