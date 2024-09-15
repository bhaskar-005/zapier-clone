import { Router } from "express";
import { authMiddleware } from "../middleware";
import { prisma } from "../prismaClient";
import { zapSchema } from "../types/zod";
const router = Router();

router.post("/create", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.id;
  const zapParsed = zapSchema.safeParse(req.body);
 
  console.log(zapParsed.error);
  
  if (!zapParsed.success) {
    return res.status(404).json({
      message: "error, not valid schema.",
    });
  }
  const createZap = await prisma.zap.create({
    data: {
      triggerId: "",
      userId: userId,
      actions: {
        create: zapParsed.data.actions.map((x) => ({
          actionId: x.availableActionId,
          metadata: x.metadata,
        })),
      },
    },
  });

  //create trigger with zap id
  const trigger = await prisma.trigger.create({
    data: {
      zapId: createZap.id,
      triggerId: zapParsed.data.availableTriggerId,
    },
  });

  //update the zap
  await prisma.zap.update({
    where: {
      id: createZap.id,
    },
    data: {
      triggerId: trigger.id,
    },include:{
        trigger:{
            include:{
                type:true
            }
        },
        actions:{
            include:{
                type:true
            }
        }
    }
  });

  return res.status(200).json({
    triggerid:trigger.id
  })
});

router.get('/',authMiddleware,async(req, res)=>{
    //@ts-ignore
    const userId = req.id;
    try {
        const zaps = await prisma.zap.findMany({
            where:{
               userId,
            },
            include:{
                trigger:{
                    include:{
                        type:true
                    }
                },
                actions:{
                    include:{
                        type:true
                    }
                }
            }
        }) 
        
        return res.status(200).json({
            zaps
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error
        })
    }
})
router.get('/:zapId',authMiddleware,async(req,res)=>{
    try {
        //@ts-ignore
        const userId = req.id;
        const zap = prisma.zap.findFirst({
            where:{
                userId:userId,
                id:req.params.zapId
            }
        })
        return res.status(200).json({
            zap,
            success:true
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error
        })
    }
})

export const zapRouter = router;
