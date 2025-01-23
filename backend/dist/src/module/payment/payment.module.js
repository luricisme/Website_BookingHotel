"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const payment_controller_1 = require("./payment.controller");
const typeorm_1 = require("@nestjs/typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const minio_service_1 = require("../../minio/minio.service");
const booking_entity_1 = require("../booking/entities/booking.entity");
const hotel_entity_1 = require("../hotel/entities/hotel.entity");
const room_type_entity_1 = require("../room_type/entites/room_type.entity");
const room_entity_1 = require("../room/entities/room.entity");
const user_entity_1 = require("../user/entities/user.entity");
const booking_detail_entity_1 = require("../booking_detail/entities/booking_detail.entity");
const booking_room_entity_1 = require("../booking_room/entities/booking_room.entity");
const booking_module_1 = require("../booking/booking.module");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([payment_entity_1.Payment, booking_entity_1.Booking, hotel_entity_1.Hotel, room_type_entity_1.RoomType, room_entity_1.Room, user_entity_1.User, booking_detail_entity_1.BookingDetail, booking_room_entity_1.BookingRoom]), booking_module_1.BookingModule],
        controllers: [payment_controller_1.PaymentController],
        providers: [payment_service_1.PaymentService, minio_service_1.MinioService],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map