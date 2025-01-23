import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    create(hotelId: string, createRoomDtos: CreateRoomDto[]): Promise<{
        status: number;
        message: string;
        rooms: any;
    }>;
    findAll(hotelId: string, query: any): Promise<{
        status: number;
        message: string;
        data: {
            all_page: number;
            total: number;
            rooms: {
                id: number;
                name: string;
                type: number;
                price: number;
                status: string;
            }[];
        };
    }>;
    findOne(id: string): string;
    update(id: string, updateRoomDto: UpdateRoomDto): string;
    remove(id: string): Promise<{
        status: number;
        message: string;
    }>;
    getTotalOccupiedRooms(id: number): Promise<{
        status: number;
        hotelId: number;
        total: number;
    }>;
    getTotalAvailableRooms(id: number): Promise<{
        status: number;
        hotelId: number;
        total: number;
    }>;
}
