import { Booking } from "@/module/booking/entities/booking.entity";
import { Image } from "@/module/image/entities/image.entity";
import { Location } from "@/module/location/entities/location.entity";
import { Report } from "@/module/report/entities/report.entity";
import { Review } from "@/module/review/entities/review.entity";
import { Room } from "@/module/room/entities/room.entity";
import { RoomType } from "@/module/room_type/entites/room_type.entity";
import { User } from "@/module/user/entities/user.entity";
export declare class Hotel {
    id: number;
    name: string;
    description: string;
    discount: number;
    phone: number;
    email: string;
    star: number;
    status: string;
    onlineMethod: boolean;
    paymentAccount: string;
    owner: User;
    userFavourited: User[];
    reviews: Review[];
    locations: Location[];
    reports: Report[];
    images: Image[];
    roomTypes: RoomType[];
    rooms: Room[];
    bookings: Booking[];
}
