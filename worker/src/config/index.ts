export const config = {
    shell: {
        environment: {
            production: {
                host: "shell.beef-burrito.devon.pizza"
            },
            development: {
                host: "localhost:8000"
            }
        }
    },
    potato: {
        environment: {
            production: {
                host: "potato.beef-burrito.devon.pizza"
            },
            development: {
                host: "localhost:8001"
            }
        }
    }
}