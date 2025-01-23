import { UserService } from '@/module/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailService } from '@/mail/mail.service';
import { ResetpassAuthDto } from './dto/resetpassword-auth.dto';
import moment from 'moment';
export declare class AuthService {
    private usersService;
    private jwtService;
    private mailService;
    constructor(usersService: UserService, jwtService: JwtService, mailService: MailService);
    validateUser(email: string, pass: string): Promise<{
        id: number;
        name: string;
        dob: Date;
        cccd: string;
        email: string;
        phone: string;
        roles: import("../module/role/entities/role.entity").Role[];
        accountType: string;
        codeId: string;
        codeExpired: Date;
        bookings: import("../module/booking/entities/booking.entity").Booking[];
        hotels: import("../module/hotel/entities/hotel.entity").Hotel[];
        hotelFavourite: import("../module/hotel/entities/hotel.entity").Hotel[];
        reviews: import("../module/review/entities/review.entity").Review[];
        bills: import("../module/bill/entities/bill.entity").Bill[];
        avatar: string;
    }>;
    login(user: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    loginWithGoogle(user: any): Promise<{
        access_token: string;
    }>;
    register(createAuthDto: CreateAuthDto, role: string): Promise<{
        name: string;
        dob: Date;
        cccd: string;
        email: string;
        password: any;
        phone: string;
        codeId: string;
        codeExpired: moment.Moment;
    }>;
    forgetPassword(email: string): Promise<string>;
    resetPassword(resetInfo: ResetpassAuthDto): Promise<string>;
}
