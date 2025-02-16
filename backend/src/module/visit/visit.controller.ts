import { Controller, Get, Query } from '@nestjs/common';
import { VisitService } from './visit.service';
import { Roles } from '@/helpers/decorator/roles';

@Controller('visit')
export class VisitController {
    constructor(
        private readonly visitService: VisitService
    ) { }

    @Get('daily-stats')
    @Roles('admin')
    async getDailyStats(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        return this.visitService.getDailyStats(startDate, endDate);
    }

    @Get('monthly-stats')
    @Roles('admin')
    async getMonthlyStats(@Query('year') year: string) {
        return this.visitService.getMonthlyStats(year);
    }
}
