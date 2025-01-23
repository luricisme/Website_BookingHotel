"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const review_entity_1 = require("../review/entities/review.entity");
const minio_service_1 = require("../../minio/minio.service");
const moment = require("moment");
let ReviewService = class ReviewService {
    constructor(reviewRepository, minioService) {
        this.reviewRepository = reviewRepository;
        this.minioService = minioService;
    }
    async create(createReviewDto) {
        const review = { ...createReviewDto, createdAt: moment().toLocaleString() };
        const res = await this.reviewRepository
            .createQueryBuilder()
            .insert()
            .into(review_entity_1.Review)
            .values({
            comment: review.comment,
            rating: review.rating,
            createdAt: review.createdAt,
            userId: review.userId,
            hotelId: review.hotelId
        })
            .execute();
        return {
            status_code: 200,
            message: "Successfully",
            data: res.raw
        };
    }
    async getReviewById(id) {
        try {
            const reviews = await this.reviewRepository
                .createQueryBuilder('review')
                .select()
                .leftJoin('review.user', 'user')
                .select([
                'review.*',
                'user.name',
                'user.avatar'
            ])
                .where({
                id: id
            })
                .execute();
            const review = reviews[0];
            return {
                status_code: 200,
                message: 'Reviews retrieved successfully',
                data: {
                    id: review.id,
                    avatar: review.user_avatar,
                    name: review.user_name,
                    rate: review.rating,
                    date: review.createdAt,
                    comment: review.comment,
                },
            };
        }
        catch (error) {
            console.error('Error getting reviews:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error. Please try again later.',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    findAll() {
        return `This action returns all review`;
    }
    findOne(id) {
        return `This action returns a #${id} review`;
    }
    update(id, updateReviewDto) {
        return `This action updates a #${id} review`;
    }
    remove(id) {
        return `This action removes a #${id} review`;
    }
    async getHotelReviews(id, getReviewDto) {
        const { page, per_page } = getReviewDto;
        try {
            const offset = (page - 1) * per_page;
            const reviews = await this.reviewRepository
                .createQueryBuilder('review')
                .leftJoin('review.user', 'user')
                .select([
                'review.id AS review_id',
                'user.avatar AS review_ava',
                'user.name AS review_user',
                'review.rating AS review_rate',
                'review.comment AS review_cmt',
                'review."createdAt" AS review_date',
            ])
                .where('review."hotelId" = :hotelId', { hotelId: id })
                .orderBy('review.createdAt', 'DESC')
                .limit(per_page)
                .offset(offset)
                .getRawMany();
            const totalCount = await this.reviewRepository
                .createQueryBuilder('review')
                .leftJoin('review.user', 'user')
                .where('review."hotelId" = :hotelId', { hotelId: id })
                .getCount();
            for (const review of reviews) {
                if (review.review_ava && !review.review_ava.startsWith("https://img.freepik.com")) {
                    review.review_ava = await this.minioService.getPresignedUrl('user_avatar/' + review.review_ava);
                }
            }
            return {
                status_code: 200,
                message: 'Reviews retrieved successfully',
                page,
                per_page,
                total: totalCount,
                total_pages: Math.ceil(totalCount / per_page),
                data: {
                    reviews: reviews.map(review => ({
                        id: review.review_id,
                        avatar: review.review_ava,
                        name: review.review_user,
                        rate: review.review_rate,
                        date: review.review_date,
                        comment: review.review_cmt,
                    })),
                },
            };
        }
        catch (error) {
            console.error('Error fetching reviews:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error. Please try again later.',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        minio_service_1.MinioService])
], ReviewService);
//# sourceMappingURL=review.service.js.map