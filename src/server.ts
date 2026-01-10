import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT;

async function server() {
    try {
        await prisma.$connect();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
};


server();