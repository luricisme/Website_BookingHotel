import { ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getError(): ForbiddenException;
    getAllUsers(role: string, req: any): Promise<{
        page: string | number | string[] | import("qs").ParsedQs | import("qs").ParsedQs[];
        per_page: string | number | string[] | import("qs").ParsedQs | import("qs").ParsedQs[];
        total: number;
        total_pages: number;
        users: import("./entities/user.entity").User[];
    }>;
    create(createUserDto: CreateUserDto): Promise<number>;
    update(updateUserDto: UpdateUserDto): Promise<{
        status: number;
        message: string;
    }>;
    uploadAvatar(file: Express.Multer.File, email: string): Promise<{
        message: string;
        image: {
            url: string;
            message?: undefined;
            error?: undefined;
        } | {
            message: string;
            error: any;
            url?: undefined;
        };
    }>;
    getImageUrl(email: string): Promise<{
        url: string;
        message?: undefined;
        error?: undefined;
    } | {
        message: string;
        error: any;
        url?: undefined;
    }>;
    delete(id: number): Promise<{
        status: number;
        message: string;
    }>;
    getFavs(req: any): Promise<{
        status: number;
        message: string;
        data: {
            all_page: number;
            total: number;
            hotels: any;
        };
    }>;
    addFav(req: any): Promise<{
        message: string;
    }>;
    deleteFav(req: any): Promise<{
        status: number;
        message: string;
    }>;
    dashboardForHotelier(hotelierId: string): Promise<import("./entities/user.entity").User[]>;
    getTotalUsers(): Promise<{
        status: number;
        totalUsers: number;
    }>;
    getTotalHotels(): Promise<{
        status: number;
        totalHotels: number;
    }>;
}
