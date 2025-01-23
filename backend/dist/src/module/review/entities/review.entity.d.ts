import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { User } from "@/module/user/entities/user.entity";
export declare class Review {
    id: number;
    comment: string;
    rating: number;
    createdAt: string;
    userId: number;
    hotelId: number;
    user: User;
    hotel: Hotel;
}
