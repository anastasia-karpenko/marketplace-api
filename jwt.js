import jwt from 'jsonwebtoken'
import "dotenv/config"

export function generateToken(userId, role){
    const payload = {
        id: userId,
        role: role
    };
    return jwt.sign(payload, process.env.SECRET_KEY)
}

export function verifyToken(token){
    return jwt.verify(token, process.env.SECRET_KEY)
}
