export const config = {
    shell: {
        environments: {
            production: {
                host: "shell.beef-burrito.devon.pizza"
            },
            development: {
                host: "localhost:8000"
            }
        }
    },
    potato: {
        environments: {
            production: {
                host: "potato.beef-burrito.devon.pizza"
            },
            development: {
                host: "localhost:8001"
            }
        }
    }
}