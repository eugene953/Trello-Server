import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserProps } from './types/userTypes';


declare module 'express-serve-static-core' {
  interface Request {
    user?: UserProps;
  }
}

const Auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No Token Provided' });
    }

    const secretKey =
      process.env.JWT_SECRET || 'zDJzXV5W5mR0Ysz2uJNhfoWvEutpZwVnPt2bG1ipnEU=';

    const decoded = jwt.verify(token, secretKey) as {
      id: string;
      role: 'user';
      fullName?: string;
    };

    if (!decoded.id || decoded.role !== 'user') {
      return res.status(401).json({ error: 'Invalid Token Payload' });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      fullName: decoded.fullName,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication Failed!' });
  }
};

export default Auth;
