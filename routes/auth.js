import express from 'express'
import { client } from '../db';
import bcrypt from 'bcrypt'

export const authRouter = express.Router()


authRouter.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await client.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return res.status(409).json({
            message: 'Email занят',
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await client.user.create({
        data: {
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });

    res.status(201).json(user);
})

authRouter.post('/login', async (req, res) => {

})

authRouter.get('/me', async (req, res) => {

})
