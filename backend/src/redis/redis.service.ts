import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly redis: Redis;

    constructor(private readonly configService: ConfigService) {
        this.redis = new Redis({
            host: this.configService.get<string>('REDIS_HOST'),
            port: this.configService.get<number>('REDIS_PORT'),
            password: this.configService.get<string>('REDIS_PASS'),
        });

        this.redis.on('connect', () => console.log('Connected to Redis'));
        this.redis.on('error', (err) => console.error('Redis Error:', err));
    }

    async set(key: string, value: any, ttl?: number) {
        await this.redis.set(key, JSON.stringify(value));
        if (ttl) await this.redis.expire(key, ttl);
    }

    async get(key: string) {
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    async del(key: string) {
        await this.redis.del(key);
    }

    async keys(pattern: string): Promise<string[]> {
        return await this.redis.keys(pattern);
    }

    onModuleDestroy() {
        this.redis.quit();
    }
}
