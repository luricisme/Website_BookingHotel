import { Hotel } from "../entities/hotel.entity";
declare const CreateHotelDto_base: import("@nestjs/mapped-types").MappedType<Omit<Partial<Hotel>, any>>;
export declare class CreateHotelDto extends CreateHotelDto_base {
    name: string;
    description: string;
    detailAddress: string;
    city: string;
    district: string;
    ward: string;
    phone: string;
    email: string;
    star: number;
}
export {};
