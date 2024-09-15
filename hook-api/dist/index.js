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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.post('/hooks/catch/:userId/:zapId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const metadata = req.body;
    //transaction -> useing Outbox Pattern so that data reach to both the places --> db and kafka queue
    try {
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const run = yield tx.zapRun.create({
                data: {
                    zapId: zapId,
                    metadata: metadata || {},
                },
            });
            yield tx.zapRunOutbox.create({
                data: {
                    zapRunId: run.id,
                },
            });
        }));
        return res.status(200).json({ message: 'stored successfully' });
    }
    catch (error) {
        console.log(error);
        return res.json({ error: error });
    }
}));
app.get('/', (req, res) => {
    const users = prisma.user.findMany();
    return res.json({
        users
    });
});
app.listen(4000, () => console.log('listening on port 4000'));
