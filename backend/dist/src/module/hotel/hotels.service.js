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
exports.HotelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hotel_entity_1 = require("./entities/hotel.entity");
const room_type_entity_1 = require("../room_type/entites/room_type.entity");
const room_entity_1 = require("../room/entities/room.entity");
const minio_service_1 = require("../../minio/minio.service");
const common_2 = require("@nestjs/common");
const image_service_1 = require("../image/image.service");
const locations_service_1 = require("../location/locations.service");
const room_type_service_1 = require("../room_type/room_type.service");
let HotelsService = class HotelsService {
    constructor(dataSource, hotelRepository, imageService, roomRepository, roomTypeRepository, minioService, locationService, roomtypeService) {
        this.dataSource = dataSource;
        this.hotelRepository = hotelRepository;
        this.imageService = imageService;
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.minioService = minioService;
        this.locationService = locationService;
        this.roomtypeService = roomtypeService;
    }
    create(createHotelDto) {
        return 'This action adds a new hotel';
    }
    async findOneByOwnerId(ownerId) {
        const queryRunner = this.dataSource.createQueryRunner();
        const res = await queryRunner.manager.query(`
      SELECT h.*, l."detailAddress"
      FROM hotel h
        JOIN hotels_locations hl ON h.id = hl."hotelId"
        JOIN location l ON l.id = hl."locationId"
      WHERE "ownerId" = ${ownerId}
    `);
        queryRunner.release();
        return res[0];
    }
    async findAll(req) {
        try {
            const { page = 1, limit = 10, sortBy = 'id', order = 'ASC', searchTerm, } = req.query;
            const queryBuilder = this.hotelRepository
                .createQueryBuilder('hotel')
                .leftJoinAndSelect('hotels_locations', 'hl', 'hl."hotelId" = hotel.id')
                .leftJoinAndSelect('user', 'u', 'u.id = hotel."ownerId"')
                .leftJoinAndSelect('location', 'l', 'l.id = hl."locationId"')
                .select(['hotel.id', 'hotel.name', 'u.name', 'l.city']);
            queryBuilder.orderBy(`hotel.${sortBy}`, order === 'ASC' ? 'ASC' : 'DESC');
            const res = await queryBuilder
                .take(+limit)
                .skip((+page - 1) * +limit)
                .getRawAndEntities();
            const hotels = res.raw.map((entity) => ({
                id: entity.hotel_id,
                name: entity.hotel_name,
                hotelierName: entity.u_name,
                location: entity.l_city,
            }));
            const total = await this.hotelRepository.count();
            return {
                page: page,
                per_page: limit,
                total,
                total_pages: Math.ceil(total / +limit),
                hotels,
            };
        }
        catch (error) {
            console.error('Error fetching all hotels:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    update(id, updateHotelDto) {
        return `This action updates a #${id} hotel`;
    }
    async remove(id) {
        try {
            const result = await this.hotelRepository.delete({ id: id });
            if (result.affected === 0) {
                return { status: 404, message: 'Hotel not found' };
            }
            return { status: 200, message: 'Delete hotel successfully' };
        }
        catch (error) {
            console.error('Error delete hotels:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTopTenRatingHotel(userId) {
        try {
            const queryBuilder = await this.hotelRepository
                .createQueryBuilder('hotel')
                .leftJoinAndSelect('hotel.images', 'image')
                .leftJoinAndSelect('hotel.locations', 'location')
                .leftJoin('hotel.reviews', 'review')
                .leftJoin('hotel.roomTypes', 'roomType')
                .select([
                'hotel.id AS id',
                'hotel.name AS name',
                'hotel.star AS star',
                'location.detailAddress AS address',
                'ARRAY_AGG(DISTINCT image.url) AS images',
                'SUM(review.rating) AS totalrating',
                'AVG(CASE WHEN review.rating IS NOT NULL THEN review.rating ELSE NULL END) AS averagerating',
                'COUNT(DISTINCT review.id) AS totalreviews',
                'MIN(roomType.price) AS minroomprice',
            ])
                .where('hotel.status = :status', { status: 'approved' })
                .groupBy('hotel.id')
                .addGroupBy('location.id')
                .orderBy('COALESCE(AVG(review.rating), 0)', 'DESC')
                .limit(10);
            const hotels = await queryBuilder.getRawMany();
            const result = await Promise.all(hotels.map(async (hotel) => {
                let isFav = false;
                if (userId) {
                    const queryRunner = this.dataSource.createQueryRunner();
                    const res = await queryRunner.query(`
              SELECT *
              FROM "user_favouriteHotel" where "hotelId" = ${hotel.id} AND "userId" = ${userId}
            `);
                    if (res.length > 0) {
                        console.log('>>> res: ', res);
                        isFav = true;
                    }
                    await queryRunner.release();
                }
                const presignedImages = await Promise.all(hotel.images.map((url) => {
                    if (url.startsWith('https://cf.bstatic.com/xdata') ||
                        url.startsWith('http://88.222.212.40')) {
                        return url;
                    }
                    else {
                        return this.minioService.getPresignedUrl('hotel_image/' + url);
                    }
                }));
                return {
                    id: hotel.id,
                    isFav,
                    name: hotel.name,
                    star: hotel.star,
                    address: hotel.address,
                    images: presignedImages,
                    averageRating: hotel.averagerating,
                    totalReviews: Number(hotel.totalreviews) || 0,
                    minRoomPrice: hotel.minroomprice,
                };
            }));
            return {
                status_code: common_1.HttpStatus.OK,
                message: 'Top 10 hotels fetched successfully',
                data: result,
            };
        }
        catch (error) {
            console.error('Error fetching top-rated hotels:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAvailableHotels(searchHotelDto, userId) {
        const { city, checkInDate, checkOutDate, roomType2, roomType4, minRating, minStar, minPrice, maxPrice, page, per_page, } = searchHotelDto;
        try {
            const queryBuilder = await this.hotelRepository
                .createQueryBuilder('hotel')
                .leftJoinAndSelect('hotel.images', 'image')
                .leftJoinAndSelect('hotel.locations', 'location')
                .leftJoin('hotel.reviews', 'review')
                .leftJoin('hotel.roomTypes', 'roomType')
                .leftJoin('roomType.rooms', 'room')
                .leftJoin('hotel.bookings', 'booking')
                .leftJoin('booking.bookingDetails', 'bookingdetail')
                .select([
                'hotel.id AS id',
                'hotel.name AS name',
                'hotel.star AS star',
                'location.city AS city',
                'location.detailAddress AS address',
                'ARRAY_AGG(DISTINCT image.url) AS images',
                'SUM(review.rating) AS totalrating',
                'AVG(CASE WHEN review.rating IS NOT NULL THEN review.rating ELSE NULL END) AS averagerating',
                'COUNT(DISTINCT review.id) AS totalreviews',
                'MIN(roomType.price) AS minroomprice',
                `COUNT(DISTINCT CASE WHEN room.type = 2 AND (room.status = 'available' OR NOT EXISTS (
            SELECT 1
            FROM booking b
            JOIN booking_detail bd ON b.id = bd."bookingId"
            WHERE b."hotelId" = hotel.id
            AND bd.type = 2
            AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
          )) THEN room.id END) AS numberoftype2`,
                `COUNT(DISTINCT CASE WHEN room.type = 4 AND (room.status = 'available' OR NOT EXISTS (
            SELECT 1
            FROM booking b
            JOIN booking_detail bd ON b.id = bd."bookingId"
            WHERE b."hotelId" = hotel.id
            AND bd.type = 4
            AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
          )) THEN room.id END) AS numberoftype4`,
            ])
                .where('hotel.status = :status', { status: 'approved' })
                .groupBy('hotel.id')
                .addGroupBy('location.id')
                .setParameters({ checkInDate, checkOutDate });
            if (city) {
                const normalizedCity = removeDiacritics(city);
                queryBuilder.andWhere('LOWER(UNACCENT(location.city)) = :city', {
                    city: normalizedCity,
                });
            }
            if (roomType2) {
                queryBuilder.andWhere((subQuery) => {
                    const sub = subQuery
                        .subQuery()
                        .select('COUNT(DISTINCT room.id)')
                        .from('Room', 'room')
                        .leftJoin('room.roomType', 'roomType')
                        .where('roomType.hotelId = hotel.id')
                        .andWhere('room.type = 2')
                        .andWhere(`(room.status = 'available' OR NOT EXISTS (
              SELECT 1
              FROM booking b
              JOIN booking_detail bd ON b.id = bd."bookingId"
              WHERE b."hotelId" = hotel.id
              AND bd.type = 2
              AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
            ))`)
                        .getQuery();
                    return `(${sub}) >= :roomType2`;
                }, { roomType2 });
            }
            if (roomType4) {
                queryBuilder.andWhere((subQuery) => {
                    const sub = subQuery
                        .subQuery()
                        .select('COUNT(DISTINCT room.id)')
                        .from('Room', 'room')
                        .leftJoin('room.roomType', 'roomType')
                        .where('roomType.hotelId = hotel.id')
                        .andWhere('room.type = 4')
                        .andWhere(`(room.status = 'available' OR NOT EXISTS (
              SELECT 1
              FROM booking b
              JOIN booking_detail bd ON b.id = bd."bookingId"
              WHERE b."hotelId" = hotel.id
              AND bd.type = 4
              AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
            ))`)
                        .getQuery();
                    return `(${sub}) >= :roomType4`;
                }, { roomType4 });
            }
            if (minStar && minStar.length > 0) {
                queryBuilder.andWhere('hotel.star IN (:...minStar)', { minStar });
            }
            if (minRating) {
                queryBuilder.having('AVG(review.rating) >= :minRating', { minRating });
            }
            if (minPrice && maxPrice) {
                queryBuilder.having('MIN(roomType.price) >= :minPrice AND MIN(roomType.price) <= :maxPrice', { minPrice, maxPrice });
            }
            else if (minPrice) {
                queryBuilder.having('MIN(roomType.price) >= :minPrice', { minPrice });
            }
            else if (maxPrice) {
                queryBuilder.having('MIN(roomType.price) <= :maxPrice', { maxPrice });
            }
            const offset = (page - 1) * per_page;
            queryBuilder.limit(per_page).offset(offset);
            const [hotels, totalHotels] = await Promise.all([
                queryBuilder.getRawMany(),
                queryBuilder.getCount(),
            ]);
            const totalPages = Math.ceil(totalHotels / per_page);
            console.log({
                page,
                per_page,
                offset,
                hotels: hotels.length,
                totalHotels,
            });
            const result = await Promise.all(hotels.map(async (hotel) => {
                let isFav = false;
                if (userId) {
                    const queryRunner = this.dataSource.createQueryRunner();
                    const res = await queryRunner.query(`
              SELECT *
              FROM "user_favouriteHotel" where "hotelId" = ${hotel.id} AND "userId" = ${userId}
            `);
                    if (res.length > 0) {
                        isFav = true;
                    }
                    await queryRunner.release();
                }
                const presignedImages = await Promise.all(hotel.images.map((url) => {
                    if (url.startsWith('https://cf.bstatic.com/xdata') ||
                        url.startsWith('http://88.222.212.40')) {
                        return url;
                    }
                    else {
                        return this.minioService.getPresignedUrl('hotel_image/' + url);
                    }
                }));
                return {
                    id: hotel.id,
                    isFav,
                    name: hotel.name,
                    star: hotel.star,
                    address: hotel.address,
                    images: presignedImages,
                    averageRating: hotel.averagerating,
                    totalReviews: Number(hotel.totalreviews) || 0,
                    minRoomPrice: hotel.minroomprice,
                    numberOfType2: Number(hotel.numberoftype2) || 0,
                    numberOfType4: Number(hotel.numberoftype4) || 0,
                };
            }));
            return {
                status_code: common_1.HttpStatus.OK,
                message: 'Search successfully',
                page,
                per_page,
                total: totalHotels,
                total_pages: totalPages,
                data: result,
            };
        }
        catch (error) {
            console.error('Error searching hotels:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id, detailHotelDto) {
        const { checkInDate, checkOutDate, roomType2, roomType4 } = detailHotelDto;
        try {
            const hotel = await this.hotelRepository
                .createQueryBuilder('hotel')
                .leftJoinAndSelect('hotel.images', 'image')
                .leftJoinAndSelect('hotel.locations', 'location')
                .leftJoin('hotel.reviews', 'review')
                .leftJoin('hotel.roomTypes', 'roomType')
                .leftJoin('roomType.rooms', 'room')
                .leftJoin('hotel.bookings', 'booking')
                .leftJoin('booking.bookingDetails', 'bookingdetail')
                .select([
                'hotel.id AS id',
                'hotel.name AS name',
                'hotel.star AS star',
                'hotel.description AS description',
                'location.detailAddress AS address',
                'ARRAY_AGG(DISTINCT image.url) AS images',
                'SUM(review.rating) AS totalrating',
                'AVG(CASE WHEN review.rating IS NOT NULL THEN review.rating ELSE NULL END) AS averagerating',
                'COUNT(DISTINCT review.id) AS totalreviews',
                'MIN(roomType.price) AS minroomprice',
                `COUNT(DISTINCT CASE WHEN room.type = 2 AND (room.status = 'available' OR NOT EXISTS (
            SELECT 1
            FROM booking b
            JOIN booking_detail bd ON b.id = bd."bookingId"
            WHERE b."hotelId" = hotel.id
            AND bd.type = 2
            AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
          )) THEN room.id END) AS numberoftype2`,
                `COUNT(DISTINCT CASE WHEN room.type = 4 AND (room.status = 'available' OR NOT EXISTS (
            SELECT 1
            FROM booking b
            JOIN booking_detail bd ON b.id = bd."bookingId"
            WHERE b."hotelId" = hotel.id
            AND bd.type = 4
            AND (b."checkinTime" < :checkOutDate AND b."checkoutTime" > :checkInDate)
          )) THEN room.id END) AS numberoftype4`,
            ])
                .where('hotel.id = :id', { id })
                .groupBy('hotel.id')
                .addGroupBy('location.id')
                .setParameters({ checkInDate, checkOutDate })
                .getRawOne();
            if (!hotel) {
                throw new common_2.NotFoundException('Hotel Not Found');
            }
            const presignedImages = await Promise.all(hotel.images.map((url) => {
                if (url.startsWith('https://cf.bstatic.com/xdata')) {
                    return url;
                }
                else {
                    return this.minioService.getPresignedUrl('hotel_image/' + url);
                }
            }));
            let roomTypes = [];
            try {
                roomTypes = await this.roomTypeRepository
                    .createQueryBuilder('room_type')
                    .leftJoinAndSelect('room_type.rooms', 'room')
                    .select([
                    'room_type.id AS id',
                    'room_type.type AS type',
                    'room_type.price AS price',
                    'room_type.weekend_price AS weekend_price',
                    'room_type.flexible_price AS flexible_price',
                ])
                    .where('room.hotelId = :hotelId', { hotelId: id })
                    .groupBy('room_type.id, room_type.type, room_type.price, room_type.weekend_price, room_type.flexible_price')
                    .getRawMany();
            }
            catch (error) {
                console.error('Error fetching rooms:', error);
                throw new Error('Internal server error');
            }
            return {
                status_code: 200,
                message: 'Hotel details retrieved successfully',
                data: {
                    id: hotel.id,
                    name: hotel.name,
                    description: hotel.description,
                    star: hotel.star,
                    address: hotel.address,
                    city: hotel.city,
                    images: presignedImages,
                    checkInDate: checkInDate,
                    checkOutDate: checkOutDate,
                    roomType2: roomType2,
                    roomType4: roomType4,
                    numberOfRoom2: Number(hotel.numberoftype2),
                    numberOfRoom4: Number(hotel.numberoftype4),
                    room_types: roomTypes.map((room) => ({
                        id: room.id,
                        type: room.type,
                        price: room.price,
                        weekend_price: room.weekend_price,
                        flexible_price: room.flexible_price,
                    })),
                },
            };
        }
        catch (error) {
            console.error('Error in findOne method:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error. Please try again later.',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async totalRequest() {
        const total = await this.hotelRepository
            .createQueryBuilder('hotel')
            .where('hotel.status = :status', { status: 'pending' })
            .getCount();
        return {
            status: 200,
            total: total,
        };
    }
    async getRequest() {
        return this.hotelRepository
            .createQueryBuilder('hotel')
            .leftJoinAndSelect('hotels_locations', 'hl', 'hotel.id = hl.hotelId')
            .leftJoinAndSelect('location', 'location', 'location.id = hl.locationId')
            .select([
            'hotel.id',
            'hotel.email',
            'hotel.name',
            'hotel.createdat',
            'hotel.status',
            'location.detailAddress',
        ])
            .where('hotel.status = :status', { status: 'pending' })
            .orderBy('hotel.id', 'ASC')
            .getRawMany();
    }
    async addBasicInfo(createHotelDto, userId) {
        const hotel = { ...createHotelDto, ownerId: userId, discount: 0 };
        const location = {
            name: hotel.ward,
            district: hotel.district,
            city: hotel.city,
            detailAddress: hotel.detailAddress,
        };
        try {
            const queryBuilder = await this.hotelRepository
                .createQueryBuilder()
                .insert()
                .into('hotel')
                .values({
                name: hotel.name,
                description: hotel.description,
                discount: hotel.discount,
                owner: { id: hotel.ownerId },
                phone: hotel.phone,
                email: hotel.email,
                star: hotel.star,
            })
                .execute();
            const hotelId = queryBuilder.raw[0].id;
            const locationId = await (await this.locationService.add(location)).raw[0].id;
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.manager.query(`
        INSERT INTO hotels_locations("hotelId", "locationId")
        VALUES (${hotelId}, ${locationId})  
      `);
            queryRunner.release();
            return {
                status: 200,
                message: 'Successfully',
                hotel: hotelId,
            };
        }
        catch (error) {
            console.error('Error when add basic info for hotel:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error. Please try again later.',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async uploadImages(images, hotelId) {
        try {
            const hotel = await this.hotelRepository.findOneBy({ id: +hotelId });
            if (!hotel) {
                throw new common_1.BadRequestException('Hotel does not exist');
            }
            const res = await this.imageService.uploadHotelImages(images, hotel);
            return {
                status: 200,
                message: 'Successfully',
                images: res,
            };
        }
        catch (error) {
            console.error('Error when upload hotel images:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error. Please try again later.',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addPaymentMethod(hotelId, body) {
        try {
            const queryBuilder = await this.hotelRepository
                .createQueryBuilder()
                .update()
                .set({
                onlineMethod: body.paymentAccount ? true : false,
                paymentAccount: body.paymentAccount ? body.paymentAccount : '',
            })
                .where({ id: +hotelId })
                .execute();
            return {
                status: 200,
                mesasge: 'Successfully',
            };
        }
        catch (error) {
            console.error('Error when set payment for hotel:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error. Please try again later.',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateHotelStatus(hotelId, status) {
        try {
            const queryRunner = this.dataSource.createQueryRunner();
            const res = await queryRunner.manager.query(`
        UPDATE hotel
        SET status = $1
        WHERE id = $2  
      `, [status, hotelId]);
            return {
                status: 200,
                message: "Successfully"
            };
        }
        catch (error) {
            console.error('Error update status for hotel:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error. Please try again later.',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.HotelsService = HotelsService;
exports.HotelsService = HotelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(hotel_entity_1.Hotel)),
    __param(3, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(4, (0, typeorm_1.InjectRepository)(room_type_entity_1.RoomType)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        image_service_1.ImageService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        minio_service_1.MinioService,
        locations_service_1.LocationsService,
        room_type_service_1.RoomTypeService])
], HotelsService);
function removeDiacritics(value) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}
//# sourceMappingURL=hotels.service.js.map