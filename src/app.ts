import express from 'express';
import cors from 'cors';
import routes from './routes';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}
));

// better auth router 
app.all("/api/v1/auth/*splat", toNodeHandler(auth));

async function createAdmin() {
    await auth.api.createUser({
        body: {
            name: "Akash",
            email: "akashabdulmazid@gmail.com",
            password: "123456",
            role: "admin"
        }
    })
};

// createAdmin();

app.use('/api/v1', routes);




export default app;