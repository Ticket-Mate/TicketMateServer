import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthResquest extends Request {
    user?: { _id: string };
}
const authMiddleware = (req: AuthResquest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        req.user = user as { _id: string };
        next();
    });
}

export default authMiddleware;