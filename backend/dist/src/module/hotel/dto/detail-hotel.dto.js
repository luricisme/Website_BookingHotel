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
exports.DetailHotelDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class DetailHotelDto {
    constructor() {
        this.checkInDate = new Date().toISOString().split('T')[0];
        this.checkOutDate = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0];
        this.roomType2 = 1;
        this.roomType4 = 1;
    }
}
exports.DetailHotelDto = DetailHotelDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DetailHotelDto.prototype, "checkInDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DetailHotelDto.prototype, "checkOutDate", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (value ? parseInt(value, 10) : 1)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], DetailHotelDto.prototype, "roomType2", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (value ? parseInt(value, 10) : 1)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], DetailHotelDto.prototype, "roomType4", void 0);
//# sourceMappingURL=detail-hotel.dto.js.map