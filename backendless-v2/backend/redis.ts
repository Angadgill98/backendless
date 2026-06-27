// redis.ts
import { createClient, type RedisClientType } from "redis";



export async function ConnectToRedis():Promise<RedisClientType >{
    const redis: RedisClientType = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    redis.on("error", (err) => {
        console.error("Redis error:", err);
    });

    if (!redis.isOpen) {
        await redis.connect();
        console.log("Redis connected");
    }

    return redis
}