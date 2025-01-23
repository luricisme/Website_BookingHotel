import { Hotel } from "@/module/hotel/entities/hotel.entity";
export declare class Report {
    id: number;
    startDate: Date;
    endDate: Date;
    totalProfit: number;
    hotel: Hotel;
}
