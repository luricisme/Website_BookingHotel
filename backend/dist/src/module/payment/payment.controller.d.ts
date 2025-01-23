import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { BookingService } from '../booking/booking.service';
export declare class PaymentController {
    private readonly paymentService;
    private readonly bookingService;
    constructor(paymentService: PaymentService, bookingService: BookingService);
    handlePaymentCallback(body: any, req: any, res: any): Promise<import("express").Response<any, Record<string, any>>>;
    deleteCookie(res: any): Promise<void>;
    create(createPaymentDto: CreatePaymentDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updatePaymentDto: UpdatePaymentDto): string;
    remove(id: string): string;
}
