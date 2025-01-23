import { DailyCheckService } from './helpers/DailyCheckService';
export declare class AppService {
    private readonly dailyCheckService;
    constructor(dailyCheckService: DailyCheckService);
    getHello(): string;
}
