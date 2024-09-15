import { Router } from "express";
import { prisma } from "../prismaClient";

const router = Router();

router.get("/available", async (req, res) => {
    const availableTriggers = await prisma.availableTrigger.findMany({});
    res.json({
        availableTriggers
    })
});

export const triggerRouter = router;