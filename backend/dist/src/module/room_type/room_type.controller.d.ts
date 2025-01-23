import { RoomTypeService } from './room_type.service';
import { CreateRoomTypeDto } from './dto/create-room_type.dto';
import { UpdateRoomTypePriceDto } from './dto/update-room_type-price.dto';
export declare class RoomTypeController {
    private readonly roomtypeService;
    constructor(roomtypeService: RoomTypeService);
    addRoomType(hotelId: string, createRoomTypeDto: CreateRoomTypeDto): Promise<{
        status: number;
        message: string;
        roomtype: any;
    }>;
    getRoomType(hotelId: string): Promise<any>;
    updatePrice(hotelId: string, type: string, updatePriceDto: UpdateRoomTypePriceDto): Promise<{
        status: number;
        message: string;
    }>;
    updateUseFlexiblePrice(hotelId: string, type: string, isUse: boolean): Promise<{
        status: number;
        message: string;
    }>;
}
