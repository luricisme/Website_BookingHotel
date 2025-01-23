import { HttpStatus } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Hotel } from '../hotel/entities/hotel.entity';
import { Room } from '../room/entities/room.entity';
import { RoomType } from '../room_type/entites/room_type.entity';
import { MinioService } from '@/minio/minio.service';
import { User } from '../user/entities/user.entity';
import { Request, Response } from 'express';
import { BookingDetail } from '../booking_detail/entities/booking_detail.entity';
import { BookingRoom } from '../booking_room/entities/booking_room.entity';
import { Payment } from '../payment/entities/payment.entity';
export declare class BookingService {
    private readonly bookingRepository;
    private readonly bookingDetailRepository;
    private readonly bookingRoomRepository;
    private readonly hotelRepository;
    private readonly userRepository;
    private readonly roomRepository;
    private readonly paymentRepository;
    private readonly roomTypeRepository;
    private readonly minioService;
    constructor(bookingRepository: Repository<Booking>, bookingDetailRepository: Repository<BookingDetail>, bookingRoomRepository: Repository<BookingRoom>, hotelRepository: Repository<Hotel>, userRepository: Repository<User>, roomRepository: Repository<Room>, paymentRepository: Repository<Payment>, roomTypeRepository: Repository<RoomType>, minioService: MinioService);
    create(createBookingDto: CreateBookingDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    checkBooking(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getInformation(req: Request): Promise<{
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
    addNote(res: Response, note: string): Promise<Response<any, Record<string, any>>>;
    processPayment(req: Request, res: Response, paymentMethod: any): Promise<Response<any, Record<string, any>>>;
    private createMomoPayment;
    updatePaymentStatus(req: Request, res: Response, body: any): Promise<Response<any, Record<string, any>>>;
    private saveBooking;
    private saveBookingDetail;
    private saveBookingRoom;
    private createPayment;
    private setStatusRoom;
    private saveDataIntoDatabase;
    findAll(getBookingDto: any): Promise<{
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
    getDetail(viewDetailBookingDto: any): Promise<{
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
    updateStatusBooking(changeStatusBookingDto: any): Promise<{
        status_code: HttpStatus;
        message: string;
    }>;
    getAllHistoryBooking(req: Request, getAllHistoryBooking: any): Promise<{
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
    findOne(id: number): string;
    update(id: number, updateBookingDto: UpdateBookingDto): string;
    remove(id: number): string;
    totalReservation(id: number): Promise<{
        status: number;
        hotelId: number;
        total: number;
    }>;
    totalcheckIn(id: number): Promise<{
        status: number;
        hotelId: number;
        total: number;
    }>;
    totalcheckOut(id: number): Promise<{
        status: number;
        hotelId: number;
        total: number;
    }>;
}
