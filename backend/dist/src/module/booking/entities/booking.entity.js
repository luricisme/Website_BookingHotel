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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const bill_entity_1 = require("../../bill/entities/bill.entity");
const booking_detail_entity_1 = require("../../booking_detail/entities/booking_detail.entity");
const booking_room_entity_1 = require("../../booking_room/entities/booking_room.entity");
const hotel_entity_1 = require("../../hotel/entities/hotel.entity");
const payment_entity_1 = require("../../payment/entities/payment.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let Booking = class Booking {
};
exports.Booking = Booking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Booking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        default: `now()`,
        nullable: true,
    }),
    __metadata("design:type", Date)
], Booking.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        default: `now()`,
        nullable: true,
    }),
    __metadata("design:type", String)
], Booking.prototype, "checkinTime", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        default: `now()`,
        nullable: true,
    }),
    __metadata("design:type", String)
], Booking.prototype, "checkoutTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.bookings),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", user_entity_1.User)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hotel_entity_1.Hotel, (hotel) => hotel.bookings),
    (0, typeorm_1.JoinColumn)({ name: "hotelId" }),
    __metadata("design:type", hotel_entity_1.Hotel)
], Booking.prototype, "hotel", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => bill_entity_1.Bill, (bill) => bill.booking),
    __metadata("design:type", bill_entity_1.Bill)
], Booking.prototype, "bill", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_detail_entity_1.BookingDetail, (bookingDetail) => bookingDetail.booking),
    __metadata("design:type", Array)
], Booking.prototype, "bookingDetails", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_room_entity_1.BookingRoom, (bookingRoom) => bookingRoom.booking),
    __metadata("design:type", Array)
], Booking.prototype, "bookingRooms", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => payment_entity_1.Payment, (payment) => payment.booking),
    __metadata("design:type", payment_entity_1.Payment)
], Booking.prototype, "payment", void 0);
exports.Booking = Booking = __decorate([
    (0, typeorm_1.Entity)({ name: "booking" })
], Booking);
//# sourceMappingURL=booking.entity.js.map