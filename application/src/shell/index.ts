import "./style.css";

(async () => {

    console.log("> shell:init:");

    const config = await import("./config");
    config.log();
    
    const template = `
        <main class="shell">
            <h1 class="shell__heading">Shell 🐚</h1>
            <p>The foundational scaffold for our Micro Front-ends.<p>
            ${config.dom()}
        </main>
    `;

    document.body.innerHTML = template;

    const potato = await import("potato/App").then(module => module.start());
    const element = document.querySelector("main");

    console.log("> shell:potato: ", potato);

    potato.dom(element);
    
})();
