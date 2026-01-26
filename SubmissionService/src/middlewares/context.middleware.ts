import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../config';
import logger from '../config/logger.config';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: { id: number; email: string };
        }
    }
}

export const attachUserContext = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, serverConfig.JWT_SECRET as string) as { id: number; email: string };
            if (decoded && decoded.id && decoded.email) {
                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                };
            }
        } catch (error) {
            logger.warn("Invalid JWT token", { error });
        }
    }
    next();
};