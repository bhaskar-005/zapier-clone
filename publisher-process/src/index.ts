import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";
const prisma = new PrismaClient();

const KAFKA_TOPIC = "zap-events";
const init = async () => {
  const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
  });

  const producer = kafka.producer();
  await producer.connect();

  while (true) {
    const zapOutbox = await prisma.zapRunOutbox.findMany({
      take: 10,
    });

    //publishing to queue
    await producer.send({
      topic: KAFKA_TOPIC,
      messages: zapOutbox.map((z) => {
        return {
          value: JSON.stringify({ zapRunId: z.zapRunId }),
        };
      }),
    });

    console.log(zapOutbox);
    
    await prisma.zapRunOutbox.deleteMany({
      where: {
        id: {
          in: zapOutbox.map((z) => z.id),
        },
      },
    });
  }
};
init();
