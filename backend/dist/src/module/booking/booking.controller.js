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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const update_booking_dto_1 = require("./dto/update-booking.dto");
const get_booking_dto_1 = require("./dto/get-booking.dto");
const view_detail_booking_dto_1 = require("./dto/view-detail-booking.dto");
const change_status_booking_dto_1 = require("./dto/change-status-booking.dto");
const public_1 = require("../../helpers/decorator/public");
const get_history_booking_dto_1 = require("./dto/get-history-booking.dto");
const roles_1 = require("../../helpers/decorator/roles");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    async check(req, res) {
        return await this.bookingService.checkBooking(req, res);
    }
    async startBooking(createBookingDto, req, res) {
        return await this.bookingService.create(createBookingDto, req, res);
    }
    async getInformation(req) {
        return await this.bookingService.getInformation(req);
    }
    async addInformation(res, note) {
        return await this.bookingService.addNote(res, note);
    }
    async finishBooking(body, req, res) {
        const paymentMethod = body.paymentMethod;
        return await this.bookingService.processPayment(req, res, paymentMethod);
    }
    async getAllBooking(getBookingDto) {
        return this.bookingService.findAll(getBookingDto);
    }
    async getDetailBooking(viewDetailBookingDto) {
        return this.bookingService.getDetail(viewDetailBookingDto);
    }
    async updateStatus(changeStatusBookingDto) {
        return await this.bookingService.updateStatusBooking(changeStatusBookingDto);
    }
    async getAllHistory(getHistoryBookingDto, req) {
        return await this.bookingService.getAllHistoryBooking(req, getHistoryBookingDto);
    }
    findOne(id) {
        return this.bookingService.findOne(+id);
    }
    update(id, updateBookingDto) {
        return this.bookingService.update(+id, updateBookingDto);
    }
    remove(id) {
        return this.bookingService.remove(+id);
    }
    async bookRoom(createBookingDto) {
    }
    async getTotalResservation(id) {
        return await this.bookingService.totalReservation(id);
    }
    async getTotalCheckIn(id) {
        return await this.bookingService.totalcheckIn(id);
    }
    async getTotalCheckOut(id) {
        return await this.bookingService.totalcheckOut(id);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.Get)('check-booking'),
    (0, roles_1.Roles)("user"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "check", null);
__decorate([
    (0, common_1.Post)('start'),
    (0, public_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "startBooking", null);
__decorate([
    (0, common_1.Get)('information'),
    (0, roles_1.Roles)("user"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getInformation", null);
__decorate([
    (0, common_1.Post)('information'),
    (0, roles_1.Roles)("user"),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "addInformation", null);
__decorate([
    (0, common_1.Post)('finish'),
    (0, roles_1.Roles)("user"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "finishBooking", null);
__decorate([
    (0, common_1.Get)('guest'),
    (0, roles_1.Roles)("hotelier"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_booking_dto_1.GetBookingDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getAllBooking", null);
__decorate([
    (0, common_1.Get)('guest/detail'),
    (0, roles_1.Roles)("hotelier", "user"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [view_detail_booking_dto_1.ViewDetailBookingDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getDetailBooking", null);
__decorate([
    (0, common_1.Patch)('guest/update-status'),
    (0, roles_1.Roles)("hotelier", "user"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_status_booking_dto_1.ChangeStatusBookingDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, roles_1.Roles)("user", "hotelier"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_history_booking_dto_1.GetHistoryBookingDto, Object]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getAllHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_dto_1.UpdateBookingDto]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('reservation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "bookRoom", null);
__decorate([
    (0, common_1.Get)('total/r/:id'),
    (0, roles_1.Roles)("hotelier"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getTotalResservation", null);
__decorate([
    (0, common_1.Get)('total/i/:id'),
    (0, roles_1.Roles)("hotelier"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getTotalCheckIn", null);
__decorate([
    (0, common_1.Get)('total/o/:id'),
    (0, roles_1.Roles)("hotelier"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookingController.prototype, "getTotalCheckOut", null);
exports.BookingController = BookingController = __decorate([
    (0, common_1.Controller)('booking'),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map