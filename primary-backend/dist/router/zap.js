"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const prismaClient_1 = require("../prismaClient");
const zod_1 = require("../types/zod");
const router = (0, express_1.Router)();
router.post("/create", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.id;
    const zapParsed = zod_1.zapSchema.safeParse(req.body);
    console.log(zapParsed.error);
    if (!zapParsed.success) {
        return res.status(404).json({
            message: "error, not valid schema.",
        });
    }
    const createZap = yield prismaClient_1.prisma.zap.create({
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
    const trigger = yield prismaClient_1.prisma.trigger.create({
        data: {
            zapId: createZap.id,
            triggerId: zapParsed.data.availableTriggerId,
        },
    });
    //update the zap
    yield prismaClient_1.prisma.zap.update({
        where: {
            id: createZap.id,
        },
        data: {
            triggerId: trigger.id,
        },
    });
    return res.status(200).json({
        triggerid: trigger.id
    });
}));
router.get('/', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.id;
    try {
        const zaps = yield prismaClient_1.prisma.zap.findMany({
            where: {
                userId,
            },
            include: {
                trigger: {
                    include: {
                        type: true
                    }
                },
                actions: {
                    include: {
                        type: true
                    }
                }
            }
        });
        return res.status(200).json({
            zaps
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error
        });
    }
}));
router.get('/:zapId', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.id;
        const zap = prismaClient_1.prisma.zap.findFirst({
            where: {
                userId: userId,
                id: req.params.zapId
            }
        });
        return res.status(200).json({
            zap,
            success: true
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error
        });
    }
}));
exports.zapRouter = router;
