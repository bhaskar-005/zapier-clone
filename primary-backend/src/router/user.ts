import { Router } from "express";
import { signIn, signUp } from "../types/zod";
import { prisma } from "../prismaClient";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware";
const router = Router();

router.post("/signup", async (req, res) => {
  const body = req.body;
  console.log(body);
  
  const parsedData = signUp.safeParse(body);

  if (!parsedData.success) {
    console.log(parsedData.error);
    return res.status(411).json({
      error: parsedData.error.message,
      message: "Incorrect inputs",
    });
  }

  const userExists = await prisma.user.findFirst({
    where: {
      email: parsedData.data.email,
    },
  });

  if (userExists) {
    return res.status(403).json({
      message: "User already exists",
    });
  }

  await prisma.user.create({
    data: {
      email: parsedData.data.email,
      // TODO: Dont store passwords in plaintext, hash it
      password: parsedData.data.password,
      name: parsedData.data.name,
    },
  });

  // await sendEmail();

  return res.json({
    message: "Please verify your account by checking your email",
  });
});

router.post("/signin", async (req, res) => {
  const body = req.body;
  const parsedData = signIn.safeParse(body);

  if (!parsedData.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: parsedData.data.email,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    return res.status(403).json({
      message: "Sorry credentials are incorrect",
    });
  }

  // sign the jwt
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_PASSWORD!
  );

  res.json({
    token: token,
  });
});

router.get("/", authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const user = await prisma.user.findFirst({
        where: {
            id
        },
        select: {
            name: true,
            email: true
        }
    });

    return res.json({
        user
    });
})

export const userRouter = router;