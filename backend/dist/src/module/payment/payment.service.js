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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const booking_entity_1 = require("../booking/entities/booking.entity");
const typeorm_1 = require("@nestjs/typeorm");
const booking_detail_entity_1 = require("../booking_detail/entities/booking_detail.entity");
const typeorm_2 = require("typeorm");
const booking_room_entity_1 = require("../booking_room/entities/booking_room.entity");
const payment_entity_1 = require("./entities/payment.entity");
const room_type_entity_1 = require("../room_type/entites/room_type.entity");
const minio_service_1 = require("../../minio/minio.service");
const user_entity_1 = require("../user/entities/user.entity");
const room_entity_1 = require("../room/entities/room.entity");
const hotel_entity_1 = require("../hotel/entities/hotel.entity");
let PaymentService = class PaymentService {
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
    async deleteCookie(res) {
        res.clearCookie('bookingData');
        res.status(200).send('Cookie "bookingData" đã được xóa!');
    }
    create(createPaymentDto) {
        return 'This action adds a new payment';
    }
    findAll() {
        return `This action returns all payment`;
    }
    findOne(id) {
        return `This action returns a #${id} payment`;
    }
    update(id, updatePaymentDto) {
        return `This action updates a #${id} payment`;
    }
    remove(id) {
        return `This action removes a #${id} payment`;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_detail_entity_1.BookingDetail)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_room_entity_1.BookingRoom)),
    __param(3, (0, typeorm_1.InjectRepository)(hotel_entity_1.Hotel)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(6, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(7, (0, typeorm_1.InjectRepository)(room_type_entity_1.RoomType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        minio_service_1.MinioService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map