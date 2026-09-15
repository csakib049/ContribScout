import express ,{NextFunction, Request,Response} from 'express';
import cors from 'cors';
import repositoriesRouter from './routes/repositories';
import { error } from 'node:console';


const app = express();

app.use(cors());
app.use(express.json());


app.get("/health",(req:Request,res:Response)=>{
    res.status(200).json({
        status:"ok"
    });
});


app.use('/api/repositories',repositoriesRouter);


//error handling
app.use((err:Error , req:Request,res:Response,next:NextFunction)=>{
    console.log(err);
    res.status(500).json({error:'Initial server error'})''
});


export default app;