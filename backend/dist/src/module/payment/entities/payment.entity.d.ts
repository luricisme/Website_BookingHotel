import { Booking } from "@/module/booking/entities/booking.entity";
export declare class Payment {
    id: number;
    date: Date;
    method: string;
    status: string;
    totalCost: number;
    booking: Booking;
}
