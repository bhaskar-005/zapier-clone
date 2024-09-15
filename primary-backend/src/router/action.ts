import { Router } from "express";
import { prisma } from "../prismaClient";

const router = Router();

router.get("/available", async (req, res) => {
    const availableActions = await prisma.availableAction.findMany({});
    res.json({
        availableActions
    })
});

export const actionRouter = router;