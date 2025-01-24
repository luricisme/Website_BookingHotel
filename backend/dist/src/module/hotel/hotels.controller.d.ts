import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { SearchHotelDto } from './dto/search-hotel.dto';
import { DetailHotelDto } from './dto/detail-hotel.dto';
export declare class HotelsController {
    private readonly hotelsService;
    constructor(hotelsService: HotelsService);
    findAll(req: any): Promise<{
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
    recommendedHotel(userId: string): Promise<{
        status_code: import("@nestjs/common").HttpStatus;
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
    findAvailableHotels(userId: string, searchHotelDto: SearchHotelDto): Promise<{
        status_code: import("@nestjs/common").HttpStatus;
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
    addBasicInfo(userId: string, createHotelDto: CreateHotelDto): Promise<{
        status: number;
        message: string;
        hotel: any;
    }>;
    uploadImages(files: Express.Multer.File[], hotelId: string): Promise<{
        status: number;
        message: string;
        images: any[];
    }>;
    addPaymentMethod(hotelId: string, body: any): Promise<{
        status: number;
        mesasge: string;
    }>;
    remove(id: string): Promise<{
        status: number;
        message: string;
    }>;
    totalDashboardRequest(): Promise<{
        status: number;
        total: number;
    }>;
    getDashboardRequest(): Promise<any[]>;
    updateHotelStatus(hotelId: number, status: string): Promise<{
        status: number;
        message: string;
    }>;
}
