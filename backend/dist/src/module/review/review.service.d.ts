import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from '../review/entities/review.entity';
import { MinioService } from '@/minio/minio.service';
import { GetReviewDto } from './dto/get-review.dto';
export declare class ReviewService {
    private readonly reviewRepository;
    private readonly minioService;
    constructor(reviewRepository: Repository<Review>, minioService: MinioService);
    create(createReviewDto: CreateReviewDto): Promise<{
        status_code: number;
        message: string;
        data: any;
    }>;
    getReviewById(id: string): Promise<{
        status_code: number;
        message: string;
        data: {
            id: any;
            avatar: any;
            name: any;
            rate: any;
            date: any;
            comment: any;
        };
    }>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateReviewDto: UpdateReviewDto): string;
    remove(id: number): string;
    getHotelReviews(id: number, getReviewDto: GetReviewDto): Promise<{
        status_code: number;
        message: string;
        page: number;
        per_page: number;
        total: number;
        total_pages: number;
        data: {
            reviews: {
                id: any;
                avatar: any;
                name: any;
                rate: any;
                date: any;
                comment: any;
            }[];
        };
    }>;
}
