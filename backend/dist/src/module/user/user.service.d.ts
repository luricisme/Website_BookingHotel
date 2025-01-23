import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import * as moment from 'moment';
import { MinioService } from '@/minio/minio.service';
import { ResetpassAuthDto } from '@/auth/dto/resetpassword-auth.dto';
export declare class UserService {
    private usersRepository;
    private dataSource;
    private readonly minioService;
    constructor(usersRepository: Repository<User>, dataSource: DataSource, minioService: MinioService);
    findAll(role: string, req: Request): Promise<{
        page: string | number | string[] | import("qs").ParsedQs | import("qs").ParsedQs[];
        per_page: string | number | string[] | import("qs").ParsedQs | import("qs").ParsedQs[];
        total: number;
        total_pages: number;
        users: User[];
    }>;
    findOne(id: number): Promise<User | null>;
    findAllFav(req: Request): Promise<{
        status: number;
        message: string;
        data: {
            all_page: number;
            total: number;
            hotels: any;
        };
    }>;
    findByEmail(email: string): Promise<User>;
    findById(id: number): Promise<User>;
    isEmailExist(email: string): Promise<boolean>;
    create(createUserDto: CreateUserDto): Promise<number>;
    createUsers(createUserDto: CreateUserDto[]): Promise<void>;
    registerUser(createAuthDto: CreateAuthDto, role: string): Promise<{
        name: string;
        dob: Date;
        cccd: string;
        email: string;
        password: any;
        phone: string;
        codeId: string;
        codeExpired: moment.Moment;
    }>;
    setupResetPassword(email: string): Promise<User>;
    resetPassword(resetInfo: ResetpassAuthDto): Promise<string>;
    update(updateUserDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
    updateUser(user: User): Promise<import("typeorm").UpdateResult>;
    uploadAvatar(file: Express.Multer.File, email: string): Promise<void>;
    getAvatarUrl(email: string): Promise<{
        url: string;
        message?: undefined;
        error?: undefined;
    } | {
        message: string;
        error: any;
        url?: undefined;
    }>;
    remove(id: number): Promise<{
        status: number;
        message: string;
    }>;
    setRole(userId: number, role: string): Promise<void>;
    getRole(userId: number): Promise<any>;
    addFav(req: Request): Promise<{
        message: string;
    }>;
    deleteFav(req: Request): Promise<{
        status: number;
        message: string;
    }>;
    dashboardForHotelier(hotelierId: number): Promise<User[]>;
    totalUsers(): Promise<{
        status: number;
        totalUsers: number;
    }>;
    totalHotels(): Promise<{
        status: number;
        totalHotels: number;
    }>;
}
