import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { Room } from "@/module/room/entities/room.entity";
export declare class RoomType {
    id: number;
    type: number;
    price: number;
    weekendPrice: number;
    flexiblePrice: number;
    useFlexiblePrice: boolean;
    normalPrice: number;
    hotel: Hotel;
    nums: number;
    rooms: Room[];
}
