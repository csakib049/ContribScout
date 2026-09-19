import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import repositoriesRouter from './routes/repositories';
import authRouter from './routes/auth';
import { env } from './config/env';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({origin: env.frontendUrl, credentials: true}));
app.use(express.json());
app.use(cookieParser());


app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: "ok"
    });
});


app.use('/api/repositories', repositoriesRouter);
app.use('/auth', authRouter);


//error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
});

export default app;