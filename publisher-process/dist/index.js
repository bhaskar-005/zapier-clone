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
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const prisma = new client_1.PrismaClient();
const KAFKA_TOPIC = "zap-events";
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const kafka = new kafkajs_1.Kafka({
        clientId: 'outbox-processor',
        brokers: ['localhost:9092']
    });
    const producer = kafka.producer();
    yield producer.connect();
    while (true) {
        const zapOutbox = yield prisma.zapRunOutbox.findMany({
            take: 10,
        });
        //publishing to queue
        yield producer.send({
            topic: KAFKA_TOPIC,
            messages: zapOutbox.map((z) => {
                return {
                    value: JSON.stringify({ zapRunId: z.zapRunId }),
                };
            }),
        });
        console.log(zapOutbox);
        yield prisma.zapRunOutbox.deleteMany({
            where: {
                id: {
                    in: zapOutbox.map((z) => z.id),
                },
            },
        });
    }
});
init();
