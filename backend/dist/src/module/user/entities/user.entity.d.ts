import { Bill } from "@/module/bill/entities/bill.entity";
import { Booking } from "@/module/booking/entities/booking.entity";
import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { Review } from "@/module/review/entities/review.entity";
import { Role } from "@/module/role/entities/role.entity";
export declare class User {
    id: number;
    name: string;
    dob: Date;
    cccd: string;
    email: string;
    password: string;
    phone: string;
    roles: Role[];
    accountType: string;
    codeId: string;
    codeExpired: Date;
    bookings: Booking[];
    hotels: Hotel[];
    hotelFavourite: Hotel[];
    reviews: Review[];
    bills: Bill[];
    avatar: string;
}
