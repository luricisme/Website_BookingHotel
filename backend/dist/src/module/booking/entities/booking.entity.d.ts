import { Bill } from "@/module/bill/entities/bill.entity";
import { BookingDetail } from "@/module/booking_detail/entities/booking_detail.entity";
import { BookingRoom } from "@/module/booking_room/entities/booking_room.entity";
import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { Payment } from "@/module/payment/entities/payment.entity";
import { User } from "@/module/user/entities/user.entity";
export declare class Booking {
    id: number;
    createdAt: Date;
    checkinTime: string;
    checkoutTime: string;
    status: string;
    note: string;
    user: User;
    hotel: Hotel;
    bill: Bill;
    bookingDetails: BookingDetail[];
    bookingRooms: BookingRoom[];
    payment: Payment;
}
