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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const typeorm_2 = require("@nestjs/typeorm");
const hotel_entity_1 = require("../hotel/entities/hotel.entity");
const room_entity_1 = require("../room/entities/room.entity");
const room_type_entity_1 = require("../room_type/entites/room_type.entity");
const minio_service_1 = require("../../minio/minio.service");
const user_entity_1 = require("../user/entities/user.entity");
const booking_detail_entity_1 = require("../booking_detail/entities/booking_detail.entity");
const booking_room_entity_1 = require("../booking_room/entities/booking_room.entity");
const axios_1 = require("axios");
const payment_entity_1 = require("../payment/entities/payment.entity");
let BookingService = class BookingService {
    constructor(bookingRepository, bookingDetailRepository, bookingRoomRepository, hotelRepository, userRepository, roomRepository, paymentRepository, roomTypeRepository, minioService) {
        this.bookingRepository = bookingRepository;
        this.bookingDetailRepository = bookingDetailRepository;
        this.bookingRoomRepository = bookingRoomRepository;
        this.hotelRepository = hotelRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.paymentRepository = paymentRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.minioService = minioService;
    }
    async create(createBookingDto, req, res) {
        try {
            const { hotelId, checkInDate, checkOutDate, roomType2, roomType4, type2Price, type4Price, sumPrice, userId, } = createBookingDto;
            const availableRoomQuery = await this.roomRepository
                .createQueryBuilder('room')
                .leftJoin('room.hotel', 'hotel')
                .select([
                'room.id AS id',
                'room.name AS name',
                'room.type AS type',
                'room.status AS status',
                'room.hotelId AS hotelid',
            ])
                .where('hotel.id = :hotelId', { hotelId })
                .andWhere('room.status = :status', { status: 'available' });
            const availableRoom = await availableRoomQuery.getRawMany();
            console.log('AVAILABLE ROOMS: ', availableRoom);
            const canBookingQuery = await this.bookingRepository
                .createQueryBuilder('booking')
                .leftJoin('booking.bookingRooms', 'bookingRoom')
                .leftJoin('bookingRoom.room', 'room')
                .where('booking.hotelId = :hotelId', { hotelId })
                .andWhere('(booking.checkinTime >= :checkOutDate OR booking.checkoutTime <= :checkInDate)', {
                checkInDate,
                checkOutDate,
            })
                .select([
                'room.id AS id',
                'room.name AS name',
                'room.type AS type',
                'room.status AS status',
                'room.hotelId AS hotelid',
            ]);
            const canBooking = await canBookingQuery.getRawMany();
            const rooms = [...availableRoom, ...canBooking];
            const roomsType2 = rooms.filter((room) => room.type === 2);
            const roomsType4 = rooms.filter((room) => room.type === 4);
            const getRandomRooms = (roomsList, count) => {
                const shuffled = roomsList.sort(() => 0.5 - Math.random());
                return shuffled.slice(0, count);
            };
            const randomRoomsType2 = getRandomRooms(roomsType2, roomType2);
            const randomRoomsType4 = getRandomRooms(roomsType4, roomType4);
            const selectedRooms = [...randomRoomsType2, ...randomRoomsType4];
            const roomIds = selectedRooms.map((room) => room.id);
            if (!roomIds || roomIds.length === 0) {
                throw new common_1.BadRequestException('No room IDs provided');
            }
            await this.roomRepository
                .createQueryBuilder()
                .update()
                .set({ status: 'pending' })
                .where('id IN (:...roomIds)', { roomIds })
                .execute();
            const bookingData = {
                hotelId,
                userId,
                checkInDate,
                checkOutDate,
                roomType2,
                type2Price,
                roomType4,
                type4Price,
                sumPrice,
                rooms: selectedRooms,
                createdAt: Date.now(),
            };
            res.cookie('bookingData', JSON.stringify(bookingData), {
                maxAge: 5 * 60 * 1000,
                httpOnly: true,
            });
            const oldState = {
                hotelId,
                availableRoom,
                canBooking,
            };
            console.log('OLD STATE: ', oldState);
            res.cookie('oldState', JSON.stringify(oldState), {
                maxAge: 6 * 60 * 1000,
                httpOnly: true,
            });
            return res.status(200).json({
                message: 'Booking data saved to cookie',
                bookingData,
            });
        }
        catch (error) {
            console.error('Error booking hotels:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkBooking(req, res) {
        try {
            const bookingData = req.cookies['bookingData'];
            if (!bookingData) {
                const oldStateCookie = req.cookies['oldState'];
                const oldState = JSON.parse(oldStateCookie);
                const { hotelId, availableRoom, canBooking } = oldState;
                const availableRoomIds = availableRoom.map((room) => room.id);
                const canBookingIds = canBooking.map((room) => room.id);
                if (canBookingIds.length > 0) {
                    await this.roomRepository
                        .createQueryBuilder()
                        .update()
                        .set({ status: 'booked' })
                        .where('hotelId = :hotelId AND id IN (:...ids)', {
                        hotelId,
                        ids: canBookingIds,
                    })
                        .execute();
                }
                if (availableRoomIds.length > 0) {
                    await this.roomRepository
                        .createQueryBuilder()
                        .update()
                        .set({ status: 'available' })
                        .where('hotelId = :hotelId AND id IN (:...ids)', {
                        hotelId,
                        ids: availableRoomIds,
                    })
                        .execute();
                }
                return res.status(common_1.HttpStatus.FORBIDDEN).json({
                    status_code: common_1.HttpStatus.FORBIDDEN,
                    message: 'Booking data has expired or not found',
                });
            }
            const parsedBookingData = JSON.parse(bookingData);
            return res.status(common_1.HttpStatus.OK).json({
                status_code: common_1.HttpStatus.OK,
                message: 'Booking data is valid',
                bookingData: parsedBookingData,
            });
        }
        catch (error) {
            console.error('Error checking booking:', error);
        }
    }
    async getInformation(req) {
        try {
            const bookingDT = req.cookies['bookingData'];
            if (!bookingDT) {
                throw new common_1.HttpException('Booking data not found in cookies', common_1.HttpStatus.NOT_FOUND);
            }
            const bookingData = JSON.parse(bookingDT);
            console.log('BOOKING DATA: ', bookingData);
            const hotelId = bookingData.hotelId;
            const hotelQuery = await this.hotelRepository
                .createQueryBuilder('hotel')
                .leftJoinAndSelect('hotel.locations', 'location')
                .select([
                'hotel.id AS id',
                'hotel.star AS star',
                'hotel.name AS name',
                'location.detailAddress AS address',
            ])
                .where('hotel.id = :hotelId', { hotelId });
            const hotel = await hotelQuery.getRawOne();
            const userId = bookingData.userId;
            const userQuery = await this.userRepository
                .createQueryBuilder('user')
                .select([
                'user.name AS name',
                'user.email AS email',
                'user.phone AS phone',
            ])
                .where('user.id = :userId', { userId });
            const user = await userQuery.getRawOne();
            const data = {
                hotel: hotel,
                checkInDate: bookingData.checkInDate,
                checkOutDate: bookingData.checkOutDate,
                roomType2: bookingData.roomType2,
                type2Price: bookingData.type2Price,
                roomType4: bookingData.roomType4,
                type4Price: bookingData.type4Price,
                sumPrice: bookingData.sumPrice,
                user: user,
            };
            return {
                message: 'Get information from cookie successfully',
                data,
            };
        }
        catch (error) {
            console.error('Error booking hotels:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addNote(res, note) {
        try {
            res.cookie('note', JSON.stringify(note), {
                maxAge: 5 * 60 * 1000,
                httpOnly: true,
            });
            return res.status(common_1.HttpStatus.OK).json({
                message: 'Note added successfully to booking data',
                note,
            });
        }
        catch (error) {
            console.error('Error booking hotels:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async processPayment(req, res, paymentMethod) {
        try {
            const bookingDT = req.cookies['bookingData'];
            const noteDT = req.cookies['note'];
            if (!bookingDT || !noteDT) {
                throw new common_1.HttpException('Booking data not found in cookies', common_1.HttpStatus.NOT_FOUND);
            }
            const bookingData = JSON.parse(bookingDT);
            const note = JSON.parse(noteDT);
            if (paymentMethod === 'cash') {
                const paymentStatus = 'unpaid';
                const bookingStatus = 'confirmed';
                await this.saveDataIntoDatabase(bookingData, paymentStatus, bookingStatus, note, paymentMethod);
                res.clearCookie('bookingData');
                return res.status(common_1.HttpStatus.OK).json({
                    status_code: common_1.HttpStatus.OK,
                    message: 'Cash successful, information saved to database.',
                });
            }
            else if (paymentMethod === 'momo') {
                const orderInfo = `Thanh toán đặt phòng khách sạn thông qua trang web đặt phòng BookAstay`;
                const paymentUrl = await this.createMomoPayment(res, orderInfo, bookingData, note);
                console.log('Payment URL:', paymentUrl);
                return res.status(common_1.HttpStatus.OK).json({
                    status_code: common_1.HttpStatus.OK,
                    message: 'Redirect to MoMo for payment.',
                    paymentUrl,
                });
            }
            throw new common_1.HttpException('Invalid payment method', common_1.HttpStatus.BAD_REQUEST);
        }
        catch (error) {
            console.error('Error processing payment:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createMomoPayment(res, orderInfo, bookingData, note) {
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;
        var orderInfo = orderInfo;
        var partnerCode = 'MOMO';
        var redirectUrl = 'http://localhost:3000/reserve';
        var ipnUrl = 'https://6bfc-113-185-82-137.ngrok-free.app/callback';
        var requestType = 'payWithMethod';
        var amount = bookingData.sumPrice;
        var orderId = partnerCode + new Date().getTime();
        var requestId = orderId;
        var orderGroupId = '';
        var autoCapture = true;
        var lang = 'vi';
        const extraData = Buffer.from(JSON.stringify({ bookingData, note })).toString('base64');
        var rawSignature = 'accessKey=' +
            accessKey +
            '&amount=' +
            amount +
            '&extraData=' +
            extraData +
            '&ipnUrl=' +
            ipnUrl +
            '&orderId=' +
            orderId +
            '&orderInfo=' +
            orderInfo +
            '&partnerCode=' +
            partnerCode +
            '&redirectUrl=' +
            redirectUrl +
            '&requestId=' +
            requestId +
            '&requestType=' +
            requestType;
        console.log('--------------------RAW SIGNATURE----------------');
        console.log(rawSignature);
        const crypto = require('crypto');
        var signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        console.log('--------------------SIGNATURE----------------');
        console.log(signature);
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature,
        });
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };
        try {
            const response = await (0, axios_1.default)(options);
            const result = response.data;
            if (result && result.payUrl) {
                return result.payUrl;
            }
            else {
                throw new Error('Failed to get payment URL from MoMo.');
            }
        }
        catch (error) {
            console.error('Error creating MoMo payment:', error.response?.data || error.message);
            throw new common_1.HttpException('Error creating MoMo payment', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePaymentStatus(req, res, body) {
        const extraData = Buffer.from(body.extraData, 'base64').toString('utf-8');
        const { bookingData, note } = JSON.parse(extraData);
        const resultCode = body.resultCode;
        if (resultCode === 0) {
            const paymentStatus = 'paid';
            const bookingStatus = 'confirmed';
            this.saveDataIntoDatabase(bookingData, paymentStatus, bookingStatus, note, 'momo');
            return res.status(common_1.HttpStatus.OK).json({
                message: 'Payment success, save data into database',
                data: { paymentStatus, bookingData },
            });
        }
        else {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: 'Payment failed, please try again.',
            });
        }
    }
    async saveBooking(bookingData, status, note) {
        try {
            const userId = bookingData.userId;
            const hotelId = bookingData.hotelId;
            const checkInDate = bookingData.checkInDate;
            const checkOutDate = bookingData.checkOutDate;
            const bookingQuery = await this.bookingRepository
                .createQueryBuilder()
                .insert()
                .into('booking')
                .values({
                user: { id: userId },
                hotel: { id: hotelId },
                checkinTime: checkInDate,
                checkoutTime: checkOutDate,
                status: status,
                note: note.note,
            })
                .returning('id')
                .execute();
            return bookingQuery.raw[0].id;
        }
        catch (error) {
            console.error('Error saving booking:', error);
            throw error;
        }
    }
    async saveBookingDetail(bookingId, bookingData) {
        try {
            const bookingDetailQuery = await this.bookingDetailRepository
                .createQueryBuilder()
                .insert()
                .into(booking_detail_entity_1.BookingDetail)
                .values([
                {
                    booking: { id: bookingId },
                    type: '2',
                    nums: bookingData.roomType2,
                    price: bookingData.type2Price,
                },
                {
                    booking: { id: bookingId },
                    type: '4',
                    nums: bookingData.roomType4,
                    price: bookingData.type4Price,
                },
            ])
                .execute();
        }
        catch (error) {
            console.error('Error saving booking detail:', error);
            throw error;
        }
    }
    async saveBookingRoom(bookingId, bookingData) {
        try {
            const bookingRoomQuery = await this.bookingRoomRepository
                .createQueryBuilder()
                .insert()
                .into(booking_room_entity_1.BookingRoom)
                .values(bookingData.rooms.map((room) => ({
                booking: { id: bookingId },
                type: room.type,
                room_name: room.name,
                room: { id: room.id },
            })))
                .execute();
        }
        catch (error) {
            console.error('Error saving booking detail:', error);
            throw error;
        }
    }
    async createPayment(bookingId, bookingData, paymentMethod, status) {
        try {
            const paymentQuery = await this.paymentRepository
                .createQueryBuilder()
                .insert()
                .into(payment_entity_1.Payment)
                .values({
                method: paymentMethod,
                status: status,
                booking: { id: bookingId },
                totalCost: bookingData.sumPrice,
            })
                .execute();
        }
        catch (error) {
            console.error('Error saving payment:', error);
            throw error;
        }
    }
    async setStatusRoom(bookingData) {
        try {
            const hotelId = bookingData.hotelId;
            const rooms = bookingData.rooms;
            const roomIds = rooms.map((room) => room.id);
            if (roomIds.length > 0) {
                await this.roomRepository
                    .createQueryBuilder()
                    .update()
                    .set({ status: 'booked' })
                    .where('hotelId = :hotelId AND id IN (:...ids)', {
                    hotelId,
                    ids: roomIds,
                })
                    .execute();
            }
        }
        catch (error) {
            console.error('Error saving payment:', error);
            throw error;
        }
    }
    async saveDataIntoDatabase(bookingData, paymentStatus, bookingStatus, note, paymentMethod) {
        try {
            const bookingId = await this.saveBooking(bookingData, bookingStatus, note);
            await this.saveBookingDetail(bookingId, bookingData);
            await this.saveBookingRoom(bookingId, bookingData);
            await this.setStatusRoom(bookingData);
            await this.createPayment(bookingId, bookingData, paymentMethod, paymentStatus);
        }
        catch (error) {
            console.error('Error saving data into database:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error while saving all data.',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll(getBookingDto) {
        try {
            const { userId, page, per_page } = getBookingDto;
            const hotelQuery = await this.hotelRepository
                .createQueryBuilder('hotel')
                .select(['hotel.id AS id'])
                .where('hotel.ownerId = :userId', { userId: userId });
            const hotel = await hotelQuery.getRawOne();
            if (!hotel) {
                throw new Error('No hotel found for the given ownerId');
            }
            const hotelId = hotel.id;
            const bookingQuery = await this.bookingRepository
                .createQueryBuilder('booking')
                .leftJoin('booking.user', 'user')
                .leftJoin('booking.payment', 'payment')
                .select([
                'booking.id AS id',
                'user.name AS name',
                'booking.checkinTime AS "checkInDate"',
                'booking.checkoutTime AS "checkOutDate"',
                'booking.status AS status',
                'payment."totalCost" AS "totalPrice"',
            ])
                .where('booking."hotelId" = :hotelId', { hotelId: hotelId })
                .orderBy('booking.createdAt', 'DESC');
            const offset = (page - 1) * per_page;
            bookingQuery.limit(per_page).offset(offset);
            const [bookings, totalBookings] = await Promise.all([
                bookingQuery.getRawMany(),
                bookingQuery.getCount(),
            ]);
            const totalPages = Math.ceil(totalBookings / per_page);
            return {
                status_code: common_1.HttpStatus.OK,
                message: 'Booking data fetched successfully',
                data: {
                    total: totalBookings,
                    page: Number(page),
                    total_page: totalPages,
                    per_page: Number(per_page),
                    bookings,
                },
            };
        }
        catch (error) {
            console.error('Error saving data into database:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error while saving all data.',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDetail(viewDetailBookingDto) {
        try {
            const { userId, bookingId, page, per_page } = viewDetailBookingDto;
            const userQuery = await this.userRepository
                .createQueryBuilder('user')
                .select([
                'user.name AS name',
                'user.email AS email',
                'user.phone AS phone',
            ])
                .where('user.id = :userId', { userId: userId });
            const user = await userQuery.getRawOne();
            if (!user) {
                throw new Error('No user found for the given userId');
            }
            const bookingQuery = await this.bookingRepository
                .createQueryBuilder('booking')
                .select(['booking.note AS note'])
                .where('booking.id = :bookingId', { bookingId });
            const booking = await bookingQuery.getRawOne();
            const note = booking.note;
            const bookingRoomQuery = await this.bookingRepository
                .createQueryBuilder('booking')
                .leftJoin('booking.bookingRooms', 'booking_room')
                .leftJoin('booking.bookingDetails', 'booking_detail')
                .select([
                'booking.id AS id',
                'booking_room.room_name AS name',
                'booking_room.type AS type',
                'booking_detail.price AS price',
            ])
                .where('booking.id = :bookingId', { bookingId })
                .andWhere('booking_detail.type = booking_room.type');
            const totalBookingRoomsQuery = this.bookingRepository
                .createQueryBuilder('booking')
                .leftJoin('booking.bookingRooms', 'booking_room')
                .leftJoin('booking.bookingDetails', 'booking_detail')
                .select('COUNT(*)', 'total')
                .where('booking.id = :bookingId', { bookingId })
                .andWhere('booking_detail.type = booking_room.type');
            const offset = (page - 1) * per_page;
            bookingRoomQuery.limit(per_page).offset(offset);
            const [bookingRooms, totalBookingRoomsResult] = await Promise.all([
                bookingRoomQuery.getRawMany(),
                totalBookingRoomsQuery.getRawOne(),
            ]);
            const totalBookingRooms = totalBookingRoomsResult?.total || 0;
            const totalPages = Math.ceil(totalBookingRooms / per_page);
            return {
                status_code: common_1.HttpStatus.OK,
                message: 'Booking data fetched successfully',
                data: {
                    total: Number(totalBookingRooms),
                    page: Number(page),
                    total_page: totalPages,
                    per_page: Number(per_page),
                    user,
                    bookingRooms,
                    note,
                },
            };
        }
        catch (error) {
            console.error('Error saving data into database:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error while saving all data.',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateStatusBooking(changeStatusBookingDto) {
        try {
            const { bookingId, status } = changeStatusBookingDto;
            const bookingRoomQuery = await this.bookingRoomRepository
                .createQueryBuilder('booking_room')
                .select('booking_room.roomId', 'roomId')
                .where('booking_room."bookingId" = :bookingId', { bookingId })
                .getRawMany();
            const roomIds = bookingRoomQuery.map((row) => row.roomId);
            console.log('ROOMIDS: ', roomIds);
            if (status === 'confirmed' && roomIds.length > 0) {
                await this.roomRepository
                    .createQueryBuilder()
                    .update()
                    .set({ status: 'booked' })
                    .where('id IN (:...roomIds)', { roomIds })
                    .execute();
            }
            else if ((status === 'completed' || status === 'cancelled') &&
                roomIds.length > 0) {
                await this.roomRepository
                    .createQueryBuilder()
                    .update()
                    .set({ status: 'available' })
                    .where('id IN (:...roomIds)', { roomIds })
                    .execute();
            }
            await this.bookingRepository
                .createQueryBuilder()
                .update()
                .set({ status })
                .where('id = :bookingId', { bookingId })
                .execute();
            return {
                status_code: common_1.HttpStatus.OK,
                message: `Booking status successfully updated to ${status}.`,
            };
        }
        catch (error) {
            console.error('Error saving data into database:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error while saving all data.',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllHistoryBooking(req, getAllHistoryBooking) {
        try {
            const { userId, page, per_page } = getAllHistoryBooking;
            const bookingQuery = await this.bookingRepository
                .createQueryBuilder('booking')
                .leftJoin('booking.hotel', 'hotel')
                .leftJoin('booking.payment', 'payment')
                .select([
                'booking.id AS id',
                'booking.createdAt AS created',
                'hotel.name AS name',
                'payment.totalCost AS totalcost',
                'booking.status AS status',
            ])
                .where('booking.userId = :userId', { userId: userId });
            const offset = (page - 1) * per_page;
            bookingQuery.limit(per_page).offset(offset);
            const [bookings, totalBookings] = await Promise.all([
                bookingQuery.getRawMany(),
                bookingQuery.getCount(),
            ]);
            const totalPages = Math.ceil(totalBookings / per_page);
            const bookingDT = req.cookies['bookingData'];
            let tempBooking = null;
            if (bookingDT) {
                const bookingData = JSON.parse(bookingDT);
                const hotelId = bookingData.hotelId;
                const hotelQuery = await this.hotelRepository
                    .createQueryBuilder('hotel')
                    .select(['hotel.name AS name'])
                    .where('hotel.id = :hotelId', { hotelId });
                const hotel = await hotelQuery.getRawOne();
                tempBooking = {
                    hotelId: hotelId,
                    totalCost: bookingData.sumPrice,
                    createAt: bookingData.createAt,
                    hotelName: hotel.name,
                    status: 'Pending',
                };
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Successfully fetched booking history.',
                data: {
                    tempBooking,
                    total: totalBookings,
                    page: page,
                    total_page: totalPages,
                    bookings,
                },
            };
        }
        catch (error) {
            console.error('Error get history:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error while get data.',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    findOne(id) {
        return `This action returns a #${id} booking`;
    }
    update(id, updateBookingDto) {
        return `This action updates a #${id} booking`;
    }
    remove(id) {
        return `This action removes a #${id} booking`;
    }
    async totalReservation(id) {
        try {
            const today = new Date();
            const todayDate = today.toISOString().split('T')[0];
            const count = await this.bookingRepository
                .createQueryBuilder('booking')
                .leftJoin('booking.hotel', 'hotel')
                .where('booking.hotelId = :hotelId', { hotelId: id })
                .andWhere('hotel.status = :status', { status: 'booked' })
                .andWhere('DATE(booking.checkinTime) <= :today', { today: todayDate })
                .andWhere('DATE(booking.checkoutTime) >= :today', { today: todayDate })
                .getCount();
            return {
                status: 200,
                hotelId: id,
                total: count,
            };
        }
        catch (error) {
            throw new Error(`Error fetching total occupied rooms: ${error.message}`);
        }
    }
    async totalcheckIn(id) {
        try {
            const today = new Date();
            const todayDate = today.toISOString().split('T')[0];
            const count = await this.bookingRepository
                .createQueryBuilder('booking')
                .leftJoin('booking.hotel', 'hotel')
                .where('booking.hotelId = :hotelId', { hotelId: id })
                .andWhere('hotel.status = :status', { status: 'booked' })
                .andWhere('DATE(booking.checkinTime) = :today', { today: todayDate })
                .getCount();
            return {
                status: 200,
                hotelId: id,
                total: count,
            };
        }
        catch (error) {
            throw new Error(`Error fetching total occupied rooms: ${error.message}`);
        }
    }
    async totalcheckOut(id) {
        try {
            const today = new Date();
            const todayDate = today.toISOString().split('T')[0];
            const count = await this.bookingRepository
                .createQueryBuilder('booking')
                .leftJoin('booking.hotel', 'hotel')
                .where('booking.hotelId = :hotelId', { hotelId: id })
                .andWhere('hotel.status = :status', { status: 'booked' })
                .andWhere('DATE(booking.checkoutTime) = :today', { today: todayDate })
                .getCount();
            return {
                status: 200,
                hotelId: id,
                total: count,
            };
        }
        catch (error) {
            throw new Error(`Error fetching total occupied rooms: ${error.message}`);
        }
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_2.InjectRepository)(booking_detail_entity_1.BookingDetail)),
    __param(2, (0, typeorm_2.InjectRepository)(booking_room_entity_1.BookingRoom)),
    __param(3, (0, typeorm_2.InjectRepository)(hotel_entity_1.Hotel)),
    __param(4, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(5, (0, typeorm_2.InjectRepository)(room_entity_1.Room)),
    __param(6, (0, typeorm_2.InjectRepository)(payment_entity_1.Payment)),
    __param(7, (0, typeorm_2.InjectRepository)(room_type_entity_1.RoomType)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        minio_service_1.MinioService])
], BookingService);
//# sourceMappingURL=booking.service.js.map