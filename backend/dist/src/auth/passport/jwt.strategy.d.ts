import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@/module/user/user.service';
import { HotelsService } from '@/module/hotel/hotels.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usersService;
    private hotelService;
    constructor(configService: ConfigService, usersService: UserService, hotelService: HotelsService);
    validate(payload: any): Promise<{
        role: any;
        hotel: any;
        id: number;
        name: string;
        dob: Date;
        cccd: string;
        email: string;
        phone: string;
        roles: import("../../module/role/entities/role.entity").Role[];
        bookings: import("../../module/booking/entities/booking.entity").Booking[];
        hotels: import("../../module/hotel/entities/hotel.entity").Hotel[];
        hotelFavourite: import("../../module/hotel/entities/hotel.entity").Hotel[];
        reviews: import("../../module/review/entities/review.entity").Review[];
        bills: import("../../module/bill/entities/bill.entity").Bill[];
        avatar: string;
    }>;
}
export {};
