import { Booking } from '@/module/booking/entities/booking.entity';
import { Room } from '@/module/room/entities/room.entity';
export declare class BookingRoom {
    id: number;
    bookingId: number;
    type: number;
    room_name: string;
    booking: Booking;
    room: Room;
}
