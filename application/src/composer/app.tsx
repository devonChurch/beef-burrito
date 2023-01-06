import React from "react";
import "./style.css";

export const App = () => {

  return (
    <h1>Composer!!!</h1>
  );
}

// export const dom = async (element: HTMLElement) => {

//     console.log("> composer:init:");

//     const config = await import("./config");
//     config.log();
    
//     const template = `
//         <main class="composer">
//             <h2 class="composer__heading">Composer 🎛️</h2>
//             <p>A supplementary Micro Front-end injected at run-time.<p>
//             ${config.dom()}
//         </main>
//     `;

//     setTimeout(() => {
//         element?.insertAdjacentHTML("beforeend", template);
//     });
// }