import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetReviewDto } from './dto/get-review.dto';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    create(createReviewDto: CreateReviewDto): Promise<{
        status_code: number;
        message: string;
        data: any;
    }>;
    getReviewByReviewId(id: string): Promise<{
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
    update(id: string, updateReviewDto: UpdateReviewDto): string;
    remove(id: string): string;
    findReviewByID(id: number, getReviewDto: GetReviewDto): Promise<{
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
