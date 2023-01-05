import Cookies from "js-cookie";
import "./style.css";

(async () => {
  console.log("> shell:init:1.0.0");

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

  const potato = await import("potato/App").then((module) => module.start());
  const element = document.querySelector("main");

  console.log("> shell:potato: ", potato);

  potato.dom(element);
})();

// const setCookieForExpriment = () => {
//   console.log("> shell:cookies: ", document.cookie);

//   const key = `composer-${window.location.host}`;
//   const value = JSON.stringify({
//     application: "potato",
//     environment: "production",
//     build: "bar",
//   });
//   const options = {
//     // Root path = access to any path.
//     path: "/",

//     // Available on all subdomains.
//     // @example
//     // + shell.beef-burrito.devon.pizza
//     // + potato.beef-burrito.devon.pizza
//     // domain: "beef-burrito.devon.pizza",
//     // domain: ".app.localhost", // <--- yes, but not for production requests.

//     // TTL of 7 days.
//     expires: 7,

//     // @todo Test `localhost` on HTTP not HTTPS implications.
//     // secure: true
//     secure: false,

//     // @todo What are the implications when coming from outside of our domain
//     // sameSite: "lax",
//     sameSite: "none" as const,
//   };

//   Cookies.set(key, value, options);
// };

// setCookieForExpriment();

// const setComposerStatus = async () => {
//   const composer = await fetch(`https://composer.beef-burrito.devon.pizza/api/set`, {
//     method: "POST",
//     mode: "cors",
//     credentials: "include"
//     // headers: new Headers({
//     //     "withCredentials" : "true"
//     // })
//     // credentials: "omit"
//     // withCredentials: true,
//   }); // .then((response) => response.json());

//   console.log("> shell:composer:data: ", await composer.json());
//   console.log("> shell:composer:status: ", composer.status);
//   console.log("> shell:composer:x-banana: ", composer.headers.get("x-banana"));
//   console.log("> shell:composer:set-cookie: ", composer.headers.get("set-cookie"));
  
//   composer.headers.forEach((key, value) => {
//     console.log(`> shell:composer:header:${key}: `, value)
//   })
//   ;
// };

// setComposerStatus();

// set-cookie: csrf=ODfZYkOwZ4zAE6XaLsQ82bgmjbtLOyiN; domain=educationperfect.com; path=/; secure; samesite=none

// set-cookie: 
// -----------

// csrf=ODfZYkOwZ4zAE6XaLsQ82bgmjbtLOyiN;
// domain=educationperfect.com;
// path=/;
// secure;
// samesite=none

// foo=bar;
// Expires=Mon, 09 Jan 2023 07:59:07 GMT;
// Domain=beef-burrito.devon.pizza;
// Path=/;
// Secure;
// SameSite=none