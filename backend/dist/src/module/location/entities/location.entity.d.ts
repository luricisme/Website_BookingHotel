import { Hotel } from "@/module/hotel/entities/hotel.entity";
export declare class Location {
    id: number;
    name: string;
    district: string;
    detailAddress: string;
    city: string;
    hotels: Hotel[];
}
