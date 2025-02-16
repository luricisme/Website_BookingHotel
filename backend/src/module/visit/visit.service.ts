import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from './entities/visit.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '@/redis/redis.service';

@Injectable()
export class VisitService {
    constructor(
        @InjectRepository(Visit)
        private readonly visitRepository: Repository<Visit>,

        private readonly redisService: RedisService,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async saveDailyVisitCount() {
        console.log('🔄 Running cron job to add visit count to database...');
        const key = 'visit_count';
        const visits = (await this.redisService.get(key)) || 0;

        if (visits > 0) {
            const today = new Date().toISOString().split('T')[0];
            let visit = await this.visitRepository.findOne({ where: { visit_date: today } });

            if (visit) {
                visit.visit_count += visits;
            } else {
                visit = this.visitRepository.create({ visit_date: today, visit_count: visits });
            }

            await this.visitRepository.save(visit);
            console.log('❄️Visit count saves to database');

            // Reset Redis về 0 
            await this.redisService.set(key, 0);
            console.log('⛄Reset visit count in redis to 0');
        }
    }

    async getDailyStats(startDate: string, endDate: string) {
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        // Truy vấn tất cả các dòng từ visit table trong khoảng thời gian
        const visits = await this.visitRepository.query(
            `
            SELECT visit_date::DATE AS date, visit_count
            FROM visit
            WHERE visit_date BETWEEN $1 AND $2
            ORDER BY visit_date ASC
            `,
            [start, end]
        );
    
        return visits;
    }
    
    async getMonthlyStats(year: string) {
        const query = this.visitRepository
            .createQueryBuilder('visit')
            .select([
                "TO_CHAR(visit.visit_date, 'YYYY-MM') AS month",
                "SUM(visit.visit_count) AS total_visits"
            ])
            .where("TO_CHAR(visit.visit_date, 'YYYY') = :year", { year })
            .groupBy("month")
            .orderBy("month", "ASC");

        return query.getRawMany();
    }
}
