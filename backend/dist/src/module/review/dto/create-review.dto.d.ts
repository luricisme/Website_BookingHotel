import { Review } from "../entities/review.entity";
declare const CreateReviewDto_base: import("@nestjs/mapped-types").MappedType<Omit<Partial<Review>, any>>;
export declare class CreateReviewDto extends CreateReviewDto_base {
    comment: string;
    rating: number;
    userId: number;
    hotelId: number;
}
export {};
