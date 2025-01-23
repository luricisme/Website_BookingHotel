import { RoomType } from "./entites/room_type.entity";
import { DataSource, Repository } from "typeorm";
import { CreateRoomTypeDto } from "./dto/create-room_type.dto";
import { UpdateRoomTypePriceDto } from "./dto/update-room_type-price.dto";
export declare class RoomTypeService {
    private readonly dataSource;
    private readonly roomtypeRepository;
    constructor(dataSource: DataSource, roomtypeRepository: Repository<RoomType>);
    addRoomType(hotelId: string, createRoomTypeDto: CreateRoomTypeDto): Promise<{
        status: number;
        message: string;
        roomtype: any;
    }>;
    updatePriceOfRoomType(hotelId: number, type: number, updatePriceDto: UpdateRoomTypePriceDto): Promise<{
        status: number;
        message: string;
    }>;
    updateUseFlexiblePrice(hotelId: number, type: string, isUse: boolean): Promise<{
        status: number;
        message: string;
    }>;
    updateNumOfRoomType(num: number, type: number, hotelId: number): Promise<any>;
    getRoomTypeByHotelId(hotelId: string): Promise<any>;
    applyWeekendPrice(): Promise<void>;
    resetNormalPrice(): Promise<void>;
}
