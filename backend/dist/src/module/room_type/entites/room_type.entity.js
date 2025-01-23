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
exports.RoomType = void 0;
const hotel_entity_1 = require("../../hotel/entities/hotel.entity");
const room_entity_1 = require("../../room/entities/room.entity");
const typeorm_1 = require("typeorm");
let RoomType = class RoomType {
};
exports.RoomType = RoomType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RoomType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RoomType.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RoomType.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'weekend_price' }),
    __metadata("design:type", Number)
], RoomType.prototype, "weekendPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'flexible_price' }),
    __metadata("design:type", Number)
], RoomType.prototype, "flexiblePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'useFlexiblePrice' }),
    __metadata("design:type", Boolean)
], RoomType.prototype, "useFlexiblePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'normalPrice' }),
    __metadata("design:type", Number)
], RoomType.prototype, "normalPrice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hotel_entity_1.Hotel, (hotel) => hotel.roomTypes, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'hotelId' }),
    __metadata("design:type", hotel_entity_1.Hotel)
], RoomType.prototype, "hotel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], RoomType.prototype, "nums", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => room_entity_1.Room, (room) => room.roomType),
    __metadata("design:type", Array)
], RoomType.prototype, "rooms", void 0);
exports.RoomType = RoomType = __decorate([
    (0, typeorm_1.Entity)({ name: "room_type" })
], RoomType);
//# sourceMappingURL=room_type.entity.js.map