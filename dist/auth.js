"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No Token Provided' });
        }
        const secretKey = process.env.JWT_SECRET || 'zDJzXV5W5mR0Ysz2uJNhfoWvEutpZwVnPt2bG1ipnEU=';
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        if (!decoded.id || decoded.role !== 'user') {
            return res.status(401).json({ error: 'Invalid Token Payload' });
        }
        req.user = {
            id: decoded.id,
            role: decoded.role,
            fullName: decoded.fullName,
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Authentication Failed!' });
    }
};
exports.default = Auth;
