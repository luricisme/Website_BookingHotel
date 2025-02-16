import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class VisitCounterMiddleware implements NestMiddleware {
    constructor(private readonly redisService: RedisService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        console.log('Middleware path:', req.path);
        if (req.path.startsWith('/hotels/recommended-hotel/')) {
            // Chỉ đếm khi vào trang chủ
            const key = 'visit_count';
            const visits = (await this.redisService.get(key)) || 0;
            await this.redisService.set(key, visits + 1); // 🕒 Dữ liệu sẽ hết hạn sau 1 ngày (24 giờ)
            console.log(`Visit count: ${visits + 1}`);
        }
        next();
    }
}
