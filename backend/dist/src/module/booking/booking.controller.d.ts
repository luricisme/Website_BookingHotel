import { HttpStatus } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { GetBookingDto } from './dto/get-booking.dto';
import { ViewDetailBookingDto } from './dto/view-detail-booking.dto';
import { ChangeStatusBookingDto } from './dto/change-status-booking.dto';
import { GetHistoryBookingDto } from './dto/get-history-booking.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    check(req: any, res: any): Promise<import("express").Response<any, Record<string, any>>>;
    startBooking(createBookingDto: CreateBookingDto, req: any, res: any): Promise<import("express").Response<any, Record<string, any>>>;
    getInformation(req: any): Promise<{
        message: string;
        data: {
            hotel: any;
            checkInDate: any;
            checkOutDate: any;
            roomType2: any;
            type2Price: any;
            roomType4: any;
            type4Price: any;
            sumPrice: any;
            user: any;
        };
    }>;
    addInformation(res: any, note: string): Promise<import("express").Response<any, Record<string, any>>>;
    finishBooking(body: {
        paymentMethod: string;
    }, req: any, res: any): Promise<import("express").Response<any, Record<string, any>>>;
    getAllBooking(getBookingDto: GetBookingDto): Promise<{
        status_code: HttpStatus;
        message: string;
        data: {
            total: number;
            page: number;
            total_page: number;
            per_page: number;
            bookings: any[];
        };
    }>;
    getDetailBooking(viewDetailBookingDto: ViewDetailBookingDto): Promise<{
        status_code: HttpStatus;
        message: string;
        data: {
            total: number;
            page: number;
            total_page: number;
            per_page: number;
            user: any;
            bookingRooms: any[];
            note: any;
        };
    }>;
    updateStatus(changeStatusBookingDto: ChangeStatusBookingDto): Promise<{
        status_code: HttpStatus;
        message: string;
    }>;
    getAllHistory(getHistoryBookingDto: GetHistoryBookingDto, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            tempBooking: any;
            total: number;
            page: any;
            total_page: number;
            bookings: any[];
        };
    }>;
    findOne(id: string): string;
    update(id: string, updateBookingDto: UpdateBookingDto): string;
    remove(id: string): string;
    bookRoom(createBookingDto: CreateBookingDto): Promise<void>;
    getTotalResservation(id: number): Promise<{
        status: number;
        hotelId: number;
        total: number;
    }>;
    getTotalCheckIn(id: number): Promise<{
        status: number;
        hotelId: number;
        total: number;
    }>;
    getTotalCheckOut(id: number): Promise<{
        status: number;
        hotelId: number;
        total: number;
    }>;
}
