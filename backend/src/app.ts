
import express ,{Request,Response} from 'express';

const app = express();

app.get("/helth",(req,res)=>{
    req.status(200).json({
        status:"ok"
    });
});


export default app;