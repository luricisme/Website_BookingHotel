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
exports.BookingDetail = void 0;
const booking_entity_1 = require("../../booking/entities/booking.entity");
const typeorm_1 = require("typeorm");
let BookingDetail = class BookingDetail {
};
exports.BookingDetail = BookingDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BookingDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BookingDetail.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BookingDetail.prototype, "nums", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BookingDetail.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking, (booking) => booking.bookingDetails),
    (0, typeorm_1.JoinColumn)({ name: "bookingId" }),
    __metadata("design:type", booking_entity_1.Booking)
], BookingDetail.prototype, "booking", void 0);
exports.BookingDetail = BookingDetail = __decorate([
    (0, typeorm_1.Entity)({ name: "booking_detail" })
], BookingDetail);
//# sourceMappingURL=booking_detail.entity.js.map