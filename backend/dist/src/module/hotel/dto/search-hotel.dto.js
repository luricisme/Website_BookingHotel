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
exports.SearchHotelDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SearchHotelDto {
    constructor() {
        this.page = 1;
        this.per_page = 6;
    }
}
exports.SearchHotelDto = SearchHotelDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchHotelDto.prototype, "city", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value || value.trim() === '') {
            return new Date().toISOString().split('T')[0];
        }
        return value;
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchHotelDto.prototype, "checkInDate", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value || value.trim() === '') {
            const today = new Date();
            const checkOutDate = new Date(today.setDate(today.getDate() + 2));
            return checkOutDate.toISOString().split('T')[0];
        }
        return value;
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchHotelDto.prototype, "checkOutDate", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (value ? parseInt(value, 10) : undefined)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchHotelDto.prototype, "roomType2", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (value ? parseInt(value, 10) : undefined)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchHotelDto.prototype, "roomType4", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (value ? parseFloat(value) : undefined)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SearchHotelDto.prototype, "minPrice", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (value ? parseFloat(value) : undefined)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SearchHotelDto.prototype, "maxPrice", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (value ? parseFloat(value) : undefined)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SearchHotelDto.prototype, "minRating", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => {
        if (!value)
            return [];
        if (typeof value === 'string') {
            return value.split(',').map((v) => parseInt(v.trim(), 10)).filter((v) => !isNaN(v));
        }
        return Array.isArray(value) ? value.map((v) => parseInt(v, 10)).filter((v) => !isNaN(v)) : [];
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsInt)({ each: true }),
    (0, class_validator_1.Min)(0, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SearchHotelDto.prototype, "minStar", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (value ? parseInt(value, 10) : 1)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchHotelDto.prototype, "page", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (value ? parseInt(value, 10) : 6)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SearchHotelDto.prototype, "per_page", void 0);
//# sourceMappingURL=search-hotel.dto.js.map