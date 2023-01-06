import * as potato from "./app";

console.log("> potato: ", potato);
document.body.innerHTML = "<main />";
const element = document.querySelector("main") as HTMLElement;
potato.dom(element);