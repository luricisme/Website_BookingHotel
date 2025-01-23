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
exports.Hotel = void 0;
const booking_entity_1 = require("../../booking/entities/booking.entity");
const image_entity_1 = require("../../image/entities/image.entity");
const location_entity_1 = require("../../location/entities/location.entity");
const report_entity_1 = require("../../report/entities/report.entity");
const review_entity_1 = require("../../review/entities/review.entity");
const room_entity_1 = require("../../room/entities/room.entity");
const room_type_entity_1 = require("../../room_type/entites/room_type.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let Hotel = class Hotel {
};
exports.Hotel = Hotel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Hotel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Hotel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Hotel.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Hotel.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Hotel.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Hotel.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Hotel.prototype, "star", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Hotel.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Hotel.prototype, "onlineMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], Hotel.prototype, "paymentAccount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.hotels),
    (0, typeorm_1.JoinColumn)({ name: "ownerId" }),
    __metadata("design:type", user_entity_1.User)
], Hotel.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.hotelFavourite),
    __metadata("design:type", Array)
], Hotel.prototype, "userFavourited", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, (review) => review.hotel),
    __metadata("design:type", Array)
], Hotel.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => location_entity_1.Location, (location) => location.hotels),
    (0, typeorm_1.JoinTable)({
        name: "hotels_locations"
    }),
    __metadata("design:type", Array)
], Hotel.prototype, "locations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_entity_1.Report, (report) => report.hotel),
    __metadata("design:type", Array)
], Hotel.prototype, "reports", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => image_entity_1.Image, (image) => image.hotel),
    __metadata("design:type", Array)
], Hotel.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_type_entity_1.RoomType, (roomType) => roomType.hotel),
    __metadata("design:type", Array)
], Hotel.prototype, "roomTypes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_entity_1.Room, (room) => room.hotel),
    __metadata("design:type", Array)
], Hotel.prototype, "rooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.hotel),
    __metadata("design:type", Array)
], Hotel.prototype, "bookings", void 0);
exports.Hotel = Hotel = __decorate([
    (0, typeorm_1.Entity)({ name: "hotel" })
], Hotel);
//# sourceMappingURL=hotel.entity.js.map