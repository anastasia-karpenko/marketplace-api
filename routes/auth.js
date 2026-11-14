import express from 'express'
import { client } from '../db';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import "dotenv/config"

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
// {email: fsdff, password: 'wrgw'}
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await client.user.findUnique({
        where : {
            email: email
        }
    })
    if (!user){
        res.status(401).json({
            error: 'Неверный email'
        })
    }
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword){
        res.status(401).json({
            error: 'Неверный пароль'
        })
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        }, process.env.SECRET_KEY)

    res.json({
        token: token
    })
})

authRouter.get('/me', async (req, res) => {
    
})

// jwt (json web token) - формат токена, который используется для передачи
// данных между сторонами. для проверки токена используется подпись. 

// sign() - позволяет сгенерировать токен
// verify() - позволяет проверить подпись токена и срок действия

// http://localhost:3000/api/auth/login

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzk0NDg0OTQ2fQ.rPA9zXRg6wfmFZxh82mgr4K7Oe_DHPsoyOce8bD0s-Q

// алгоритм работы jwt:

// 1. пользователь вводит логин и пароль
// 2. клиент(браузер) отправляет POST запрос на сервер
// 3. сервер проверяет данные, если все верно - генерирует токен
// 4. сервер отправляет токен клиенту
// 5. при последующих запросах клиент передает токен в 
// заголовке запроса. название заголовка - authorization
// 6. сервер проверяет подпись и срок действия токена
// 7. либо дает доступ к сайте, либо выдает ошибку