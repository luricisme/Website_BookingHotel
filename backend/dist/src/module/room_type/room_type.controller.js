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
exports.RoomTypeController = void 0;
const common_1 = require("@nestjs/common");
const room_type_service_1 = require("./room_type.service");
const public_1 = require("../../helpers/decorator/public");
const create_room_type_dto_1 = require("./dto/create-room_type.dto");
const update_room_type_price_dto_1 = require("./dto/update-room_type-price.dto");
const roles_1 = require("../../helpers/decorator/roles");
let RoomTypeController = class RoomTypeController {
    constructor(roomtypeService) {
        this.roomtypeService = roomtypeService;
    }
    async addRoomType(hotelId, createRoomTypeDto) {
        return await this.roomtypeService.addRoomType(hotelId, createRoomTypeDto);
    }
    async getRoomType(hotelId) {
        return await this.roomtypeService.getRoomTypeByHotelId(hotelId);
    }
    async updatePrice(hotelId, type, updatePriceDto) {
        return await this.roomtypeService.updatePriceOfRoomType(+hotelId, +type, updatePriceDto);
    }
    async updateUseFlexiblePrice(hotelId, type, isUse) {
        return await this.roomtypeService.updateUseFlexiblePrice(+hotelId, type, isUse);
    }
};
exports.RoomTypeController = RoomTypeController;
__decorate([
    (0, common_1.Post)('add/:hotelId'),
    (0, public_1.Public)(),
    __param(0, (0, common_1.Param)('hotelId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_room_type_dto_1.CreateRoomTypeDto]),
    __metadata("design:returntype", Promise)
], RoomTypeController.prototype, "addRoomType", null);
__decorate([
    (0, common_1.Get)(':hotelId'),
    (0, roles_1.Roles)('hotelier'),
    __param(0, (0, common_1.Param)('hotelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomTypeController.prototype, "getRoomType", null);
__decorate([
    (0, common_1.Post)('price/:hotelId/:type'),
    (0, roles_1.Roles)('hotelier'),
    __param(0, (0, common_1.Param)('hotelId')),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_room_type_price_dto_1.UpdateRoomTypePriceDto]),
    __metadata("design:returntype", Promise)
], RoomTypeController.prototype, "updatePrice", null);
__decorate([
    (0, common_1.Get)('price/isFlexiblePrice/:hotelId/:type/:isUse'),
    (0, roles_1.Roles)('hotelier'),
    __param(0, (0, common_1.Param)('hotelId')),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Param)('isUse')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], RoomTypeController.prototype, "updateUseFlexiblePrice", null);
exports.RoomTypeController = RoomTypeController = __decorate([
    (0, common_1.Controller)('room_types'),
    __metadata("design:paramtypes", [room_type_service_1.RoomTypeService])
], RoomTypeController);
//# sourceMappingURL=room_type.controller.js.map