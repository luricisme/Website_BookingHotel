import { BookingRoom } from "@/module/booking_room/entities/booking_room.entity";
import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { RoomType } from "@/module/room_type/entites/room_type.entity";
export declare class Room {
    id: number;
    name: string;
    type: number;
    status: string;
    hotelId: number;
    hotel: Hotel;
    roomType: RoomType;
    bookingRooms: BookingRoom[];
}
