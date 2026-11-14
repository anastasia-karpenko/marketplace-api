import "dotenv/config"
import { verifyToken } from './jwt'

  export function authenticate(req, res, next){
    try{
        const token = req.headers.authorization.split(' ')[1]
        const payload = verifyToken(token)
        req.user = {
            id: payload.id,
            role: payload.role
        }
        next()
    }
    catch{
        return res.status(401).json({
            error: 'Неправильный токен'
        })
}
}

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Недостаточно прав'
      })
    }
    next()
  }
}

