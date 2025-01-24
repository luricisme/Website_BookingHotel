import { HttpStatus } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { DataSource, Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { RoomType } from '../room_type/entites/room_type.entity';
import { Room } from '../room/entities/room.entity';
import { MinioService } from '@/minio/minio.service';
import { SearchHotelDto } from './dto/search-hotel.dto';
import { DetailHotelDto } from './dto/detail-hotel.dto';
import { ImageService } from '../image/image.service';
import { LocationsService } from '../location/locations.service';
import { RoomTypeService } from '../room_type/room_type.service';
export declare class HotelsService {
    private dataSource;
    private readonly hotelRepository;
    private readonly imageService;
    private readonly roomRepository;
    private readonly roomTypeRepository;
    private readonly minioService;
    private readonly locationService;
    private readonly roomtypeService;
    constructor(dataSource: DataSource, hotelRepository: Repository<Hotel>, imageService: ImageService, roomRepository: Repository<Room>, roomTypeRepository: Repository<RoomType>, minioService: MinioService, locationService: LocationsService, roomtypeService: RoomTypeService);
    findOneByOwnerId(ownerId: number): Promise<any>;
    findAll(req: {
        query: {
            page?: 1;
            limit?: 10;
            sortBy?: 'id';
            order?: 'ASC';
            searchTerm: any;
        };
    }): Promise<{
        page: 1;
        per_page: 10;
        total: number;
        total_pages: number;
        hotels: {
            id: any;
            name: any;
            hotelierName: any;
            location: any;
        }[];
    }>;
    remove(id: number): Promise<{
        status: number;
        message: string;
    }>;
    getTopTenRatingHotel(userId: number): Promise<{
        status_code: HttpStatus;
        message: string;
        data: {
            id: any;
            isFav: boolean;
            name: any;
            star: any;
            address: any;
            images: any[];
            averageRating: any;
            totalReviews: number;
            minRoomPrice: any;
        }[];
    }>;
    findAvailableHotels(searchHotelDto: SearchHotelDto, userId: number): Promise<{
        status_code: HttpStatus;
        message: string;
        page: number;
        per_page: number;
        total: number;
        total_pages: number;
        data: {
            id: any;
            isFav: boolean;
            name: any;
            star: any;
            address: any;
            images: any[];
            averageRating: any;
            totalReviews: number;
            minRoomPrice: any;
            numberOfType2: number;
            numberOfType4: number;
        }[];
    }>;
    findOne(id: number, detailHotelDto: DetailHotelDto): Promise<{
        status_code: number;
        message: string;
        data: {
            id: any;
            name: any;
            description: any;
            star: any;
            address: any;
            city: any;
            images: any[];
            checkInDate: string;
            checkOutDate: string;
            roomType2: number;
            roomType4: number;
            numberOfRoom2: number;
            numberOfRoom4: number;
            room_types: {
                id: any;
                type: any;
                price: any;
                weekend_price: any;
                flexible_price: any;
            }[];
        };
    }>;
    totalRequest(): Promise<{
        status: number;
        total: number;
    }>;
    getRequest(): Promise<any[]>;
    addBasicInfo(createHotelDto: CreateHotelDto, userId: string): Promise<{
        status: number;
        message: string;
        hotel: any;
    }>;
    uploadImages(images: Express.Multer.File[], hotelId: string): Promise<{
        status: number;
        message: string;
        images: any[];
    }>;
    addPaymentMethod(hotelId: string, body: any): Promise<{
        status: number;
        mesasge: string;
    }>;
    updateHotelStatus(hotelId: number, status: string): Promise<{
        status: number;
        message: string;
    }>;
}
