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
exports.HotelsController = void 0;
const common_1 = require("@nestjs/common");
const public_1 = require("../../helpers/decorator/public");
const hotels_service_1 = require("./hotels.service");
const create_hotel_dto_1 = require("./dto/create-hotel.dto");
const update_hotel_dto_1 = require("./dto/update-hotel.dto");
const search_hotel_dto_1 = require("./dto/search-hotel.dto");
const detail_hotel_dto_1 = require("./dto/detail-hotel.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const roles_1 = require("../../helpers/decorator/roles");
let HotelsController = class HotelsController {
    constructor(hotelsService) {
        this.hotelsService = hotelsService;
    }
    create(createHotelDto) {
        return this.hotelsService.create(createHotelDto);
    }
    findAll(req) {
        return this.hotelsService.findAll(req);
    }
    async addBasicInfo(userId, createHotelDto) {
        return await this.hotelsService.addBasicInfo(createHotelDto, userId);
    }
    async uploadImages(files, hotelId) {
        console.log('>>> files', files);
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('At least one file is required');
        }
        return await this.hotelsService.uploadImages(files, hotelId);
    }
    async addPaymentMethod(hotelId, body) {
        return await this.hotelsService.addPaymentMethod(hotelId, body);
    }
    update(id, updateHotelDto) {
        return this.hotelsService.update(+id, updateHotelDto);
    }
    remove(id) {
        return this.hotelsService.remove(+id);
    }
    async recommendedHotel(userId) {
        return await this.hotelsService.getTopTenRatingHotel(+userId);
    }
    async findAvailableHotels(userId, searchHotelDto) {
        return await this.hotelsService.findAvailableHotels(searchHotelDto, +userId);
    }
    async findOne(id, detailHotelDto) {
        return await this.hotelsService.findOne(id, detailHotelDto);
    }
    async totalDashboardRequest() {
        return await this.hotelsService.totalRequest();
    }
    async getDashboardRequest() {
        return await this.hotelsService.getRequest();
    }
    async updateHotelStatus(hotelId, status) {
        return await this.hotelsService.updateHotelStatus(hotelId, status);
    }
};
exports.HotelsController = HotelsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hotel_dto_1.CreateHotelDto]),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('getAll'),
    (0, roles_1.Roles)('admin'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('add/basicInfo/:userId'),
    (0, public_1.Public)(),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_hotel_dto_1.CreateHotelDto]),
    __metadata("design:returntype", Promise)
], HotelsController.prototype, "addBasicInfo", null);
__decorate([
    (0, common_1.Post)('images/upload/:hotelId'),
    (0, public_1.Public)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 15, {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 2 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Param)('hotelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], HotelsController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Post)('payment/add/:hotelId'),
    (0, public_1.Public)(),
    __param(0, (0, common_1.Param)('hotelId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HotelsController.prototype, "addPaymentMethod", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_hotel_dto_1.UpdateHotelDto]),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HotelsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('recommended-hotel/:userId'),
    (0, public_1.Public)(),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HotelsController.prototype, "recommendedHotel", null);
__decorate([
    (0, common_1.Get)('search/:userId'),
    (0, public_1.Public)(),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, search_hotel_dto_1.SearchHotelDto]),
    __metadata("design:returntype", Promise)
], HotelsController.prototype, "findAvailableHotels", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_1.Public)(),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, detail_hotel_dto_1.DetailHotelDto]),
    __metadata("design:returntype", Promise)
], HotelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('admin/dashboard/t/request'),
    (0, public_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HotelsController.prototype, "totalDashboardRequest", null);
__decorate([
    (0, common_1.Get)('admin/dashboard/ga/request'),
    (0, public_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HotelsController.prototype, "getDashboardRequest", null);
__decorate([
    (0, common_1.Get)('updateHotelStatus/:hotelId/:status'),
    (0, roles_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('hotelId')),
    __param(1, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], HotelsController.prototype, "updateHotelStatus", null);
exports.HotelsController = HotelsController = __decorate([
    (0, common_1.Controller)('hotels'),
    __metadata("design:paramtypes", [hotels_service_1.HotelsService])
], HotelsController);
//# sourceMappingURL=hotels.controller.js.map