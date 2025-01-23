import { Booking } from "@/module/booking/entities/booking.entity";
import { User } from "@/module/user/entities/user.entity";
export declare class Bill {
    id: number;
    numOfDay: number;
    createdAt: Date;
    totalCost: number;
    booking: Booking;
    user: User;
}
