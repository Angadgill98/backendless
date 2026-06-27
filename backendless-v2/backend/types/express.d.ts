import "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: any; // replace `any` with your JWT payload type if you want
    }
}