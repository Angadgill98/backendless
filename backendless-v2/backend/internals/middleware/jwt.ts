import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.jwt||"my_secret_key";

export function AccessToken(user: { userid: string; email: string }) {
    return jwt.sign(
        {
            userid: user.userid,
            email: user.email
        },
        SECRET,
        { expiresIn: "6h" }
    );
}
export function RefreshToken(user: { userid: string; email: string }) {
    return jwt.sign(
        {
            userid: user.userid,
            email: user.email
        },
        SECRET,
        { expiresIn: "24h" }
    );
}
export const authMiddleware:RequestHandler=(req: Request, res: Response, next: NextFunction)=> {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).send("No token");
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send("Invalid token");
    }
}