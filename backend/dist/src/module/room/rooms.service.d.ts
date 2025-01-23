import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { DataSource, Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomTypeService } from '../room_type/room_type.service';
export declare class RoomsService {
    private readonly roomtypeService;
    private readonly dataSource;
    private readonly roomRepository;
    constructor(roomtypeService: RoomTypeService, dataSource: DataSource, roomRepository: Repository<Room>);
    create(createRoomDtos: CreateRoomDto[], hotelId: string): Promise<{
        status: number;
        message: string;
        rooms: any;
    }>;
    findAll(hotelId: number, query: any): Promise<{
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
    findOne(id: number): string;
    update(id: number, updateRoomDto: UpdateRoomDto): string;
    remove(id: number): Promise<{
        status: number;
        message: string;
    }>;
    totalOccupied(id: number): Promise<{
        status: number;
        hotelId: number;
        total: number;
    }>;
    totalAvailable(id: number): Promise<{
        status: number;
        hotelId: number;
        total: number;
    }>;
}
