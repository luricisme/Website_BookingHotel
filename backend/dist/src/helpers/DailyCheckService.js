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
exports.DailyCheckService = void 0;
const room_type_service_1 = require("../module/room_type/room_type.service");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
let DailyCheckService = class DailyCheckService {
    constructor(roomtypeService) {
        this.roomtypeService = roomtypeService;
    }
    async setWeekendPrice() {
        console.log("weekend start");
        await this.roomtypeService.applyWeekendPrice();
    }
    async resetWeekendPrice() {
        console.log("weekend end");
        await this.roomtypeService.resetNormalPrice();
    }
};
exports.DailyCheckService = DailyCheckService;
__decorate([
    (0, schedule_1.Cron)('0 0 * * 6'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DailyCheckService.prototype, "setWeekendPrice", null);
__decorate([
    (0, schedule_1.Cron)('0 0 * * 1'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DailyCheckService.prototype, "resetWeekendPrice", null);
exports.DailyCheckService = DailyCheckService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [room_type_service_1.RoomTypeService])
], DailyCheckService);
//# sourceMappingURL=DailyCheckService.js.map