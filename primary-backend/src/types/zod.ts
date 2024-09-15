import e from 'express';
import z from 'zod';

export const signUp = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string()
})

export const signIn = z.object({
    email: z.string().email(),
    password:z.string()
})

export const zapSchema = z.object({
    availableTriggerId: z.string(),
    actions : z.array(z.object(
       { 
        availableActionId: z.string(),
        metadata:z.any().optional()
       }
    ))
})