console.log("> hello:app-shell");

import("./config").then(module => {
    module.log();
})