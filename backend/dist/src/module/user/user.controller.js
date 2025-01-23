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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const public_1 = require("../../helpers/decorator/public");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const roles_1 = require("../../helpers/decorator/roles");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getError() {
        return new common_1.ForbiddenException('forbidden', 'forbidden desc');
    }
    async getAllUsers(role, req) {
        return await this.userService.findAll(role, req);
    }
    async create(createUserDto) {
        return await this.userService.create(createUserDto);
    }
    async update(updateUserDto) {
        let result = await this.userService.update(updateUserDto);
        if (result.affected === 0) {
            throw new common_1.BadRequestException('no record has been updated');
        }
        return {
            status: 201,
            message: 'Updated',
        };
    }
    async uploadAvatar(file, email) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        await this.userService.uploadAvatar(file, email);
        return {
            message: 'Avatar has uploaded',
            image: await this.getImageUrl(email),
        };
    }
    async getImageUrl(email) {
        const result = await this.userService.getAvatarUrl(email);
        return result;
    }
    async delete(id) {
        return await this.userService.remove(+id);
    }
    async getFavs(req) {
        return await this.userService.findAllFav(req);
    }
    async addFav(req) {
        return await this.userService.addFav(req);
    }
    async deleteFav(req) {
        return await this.userService.deleteFav(req);
    }
    async dashboardForHotelier(hotelierId) {
        return this.userService.dashboardForHotelier(hotelierId);
    }
    async getTotalUsers() {
        return await this.userService.totalUsers();
    }
    async getTotalHotels() {
        return await this.userService.totalHotels();
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('error'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getError", null);
__decorate([
    (0, common_1.Get)('getAll/:role'),
    (0, roles_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('role')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('avatar/upload/:email'),
    (0, roles_1.Roles)('user', 'hotelier'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Get)('avatar/url/:email'),
    (0, roles_1.Roles)('user', 'hotelier'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getImageUrl", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    (0, roles_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('fav'),
    (0, roles_1.Roles)('user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFavs", null);
__decorate([
    (0, common_1.Get)('addFav'),
    (0, roles_1.Roles)('user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addFav", null);
__decorate([
    (0, common_1.Get)('deleteFav'),
    (0, roles_1.Roles)('user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteFav", null);
__decorate([
    (0, common_1.Get)('hotelier/dashboard/:hotelierId'),
    (0, roles_1.Roles)('hotelier'),
    __param(0, (0, common_1.Param)('hotelierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "dashboardForHotelier", null);
__decorate([
    (0, common_1.Get)('admin/dashboard/t/user'),
    (0, public_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTotalUsers", null);
__decorate([
    (0, common_1.Get)('admin/dashboard/t/hotel'),
    (0, roles_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTotalHotels", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map