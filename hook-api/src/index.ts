import express from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express();

app.post('/hooks/catch/:userId/:zapId',async(req,res)=>{
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const metadata = req.body;
    
    //transaction -> useing Outbox Pattern so that data reach to both the places --> db and kafka queue
    try {
      await prisma.$transaction(async (tx) => {
        const run = await tx.zapRun.create({
          data: {
            zapId: zapId,
            metadata: metadata||{},
          },
        });

        await tx.zapRunOutbox.create({
          data: {
            zapRunId: run.id,
          },
        });
      });

      return res.status(200).json(
        {message:'stored successfully'}
      )
    } catch (error) {
      console.log(error);

      return res.json({ error: error });
    }
})

app.get('/',(req,res)=>{
    const users = prisma.user.findMany();
   return res.json({
     users
   })
})

app.listen(4000,()=>console.log('listening on port 4000'))