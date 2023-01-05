import "./style.css";

export const dom = async (element: HTMLElement) => {

    console.log("> potato:init:");

    const config = await import("./config");
    config.log();
    
    const template = `
        <main class="potato">
            <h2 class="potato__heading">Potato 🥔</h2>
            <p>A supplementary Micro Front-end injected at run-time.<p>
            ${config.dom()}
        </main>
    `;

    setTimeout(() => {
        element?.insertAdjacentHTML("beforeend", template);
    });
}