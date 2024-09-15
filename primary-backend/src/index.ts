import express from 'express';
import cors from 'cors'
import { userRouter } from './router/user';
import { triggerRouter } from './router/triggers';
import { actionRouter } from './router/action';
import { zapRouter } from './router/zap';
import bodyParser from 'body-parser';

const app = express();
express.json();
app.use(cors());
app.use(bodyParser.json())

app.use('/api/user',userRouter);
app.use('/api/trigger',triggerRouter);
app.use('/api/action',actionRouter);
app.use('/api/zap',zapRouter)

app.listen(5000, ()=>{
    console.log('listening on port 5000');
})