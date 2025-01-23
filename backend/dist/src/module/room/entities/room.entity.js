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
exports.Room = void 0;
const booking_room_entity_1 = require("../../booking_room/entities/booking_room.entity");
const hotel_entity_1 = require("../../hotel/entities/hotel.entity");
const room_type_entity_1 = require("../../room_type/entites/room_type.entity");
const typeorm_1 = require("typeorm");
let Room = class Room {
};
exports.Room = Room;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Room.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Room.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "hotelId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hotel_entity_1.Hotel, (hotel) => hotel.rooms),
    (0, typeorm_1.JoinColumn)({ name: "hotelId" }),
    __metadata("design:type", hotel_entity_1.Hotel)
], Room.prototype, "hotel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_type_entity_1.RoomType, (roomType) => roomType.rooms),
    (0, typeorm_1.JoinColumn)({ name: "roomTypeId" }),
    __metadata("design:type", room_type_entity_1.RoomType)
], Room.prototype, "roomType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_room_entity_1.BookingRoom, bookingRoom => bookingRoom.room),
    __metadata("design:type", Array)
], Room.prototype, "bookingRooms", void 0);
exports.Room = Room = __decorate([
    (0, typeorm_1.Entity)({ name: "room" })
], Room);
//# sourceMappingURL=room.entity.js.map