"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModule = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const booking_controller_1 = require("./booking.controller");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const minio_service_1 = require("../../minio/minio.service");
const hotel_entity_1 = require("../hotel/entities/hotel.entity");
const room_type_entity_1 = require("../room_type/entites/room_type.entity");
const room_entity_1 = require("../room/entities/room.entity");
const user_entity_1 = require("../user/entities/user.entity");
const booking_detail_entity_1 = require("../booking_detail/entities/booking_detail.entity");
const booking_room_entity_1 = require("../booking_room/entities/booking_room.entity");
const payment_entity_1 = require("../payment/entities/payment.entity");
let BookingModule = class BookingModule {
};
exports.BookingModule = BookingModule;
exports.BookingModule = BookingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([booking_entity_1.Booking, hotel_entity_1.Hotel, room_type_entity_1.RoomType, room_entity_1.Room, user_entity_1.User, booking_detail_entity_1.BookingDetail, booking_room_entity_1.BookingRoom, payment_entity_1.Payment])],
        controllers: [booking_controller_1.BookingController],
        providers: [booking_service_1.BookingService, minio_service_1.MinioService],
        exports: [booking_service_1.BookingService]
    })
], BookingModule);
//# sourceMappingURL=booking.module.js.map