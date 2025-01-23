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
exports.RoomTypeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const room_type_entity_1 = require("./entites/room_type.entity");
const typeorm_2 = require("typeorm");
let RoomTypeService = class RoomTypeService {
    constructor(dataSource, roomtypeRepository) {
        this.dataSource = dataSource;
        this.roomtypeRepository = roomtypeRepository;
    }
    async addRoomType(hotelId, createRoomTypeDto) {
        try {
            const doubleRoom = {
                type: 2,
                price: createRoomTypeDto.doubleRoomPrice,
                weekendPrice: createRoomTypeDto.doubleRoomPrice + 150000,
                flexiblePrice: createRoomTypeDto.doubleRoomPrice + 200000,
                hotel: { id: hotelId },
                nums: 0,
                useFlexiblePrice: false,
                normalPrice: createRoomTypeDto.doubleRoomPrice
            };
            const quadRoom = {
                type: 4,
                price: createRoomTypeDto.quadRoomPrice,
                weekendPrice: createRoomTypeDto.quadRoomPrice + 150000,
                flexiblePrice: createRoomTypeDto.quadRoomPrice + 200000,
                hotel: { id: hotelId },
                nums: 0,
                useFlexiblePrice: false,
                normalPrice: createRoomTypeDto.quadRoomPrice
            };
            const queryBuilder = await this.roomtypeRepository.createQueryBuilder()
                .insert()
                .into('room_type')
                .values([doubleRoom, quadRoom])
                .execute();
            return {
                status: 200,
                message: "Successfully",
                roomtype: queryBuilder.raw.map((obj) => obj.id)
            };
        }
        catch (error) {
            console.error('Error when set price for rooms:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error. Please try again later.',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePriceOfRoomType(hotelId, type, updatePriceDto) {
        try {
            const queryRunner = this.dataSource.createQueryRunner();
            const res = await queryRunner.manager.query(`
            UPDATE room_type
            SET price = $1, weekend_price = $2, flexible_price = $3, "normalPrice" = $4
            WHERE type = $5 AND "hotelId" = $6    
        `, [
                updatePriceDto.price,
                updatePriceDto.weekendPrice,
                updatePriceDto.flexiblePrice,
                updatePriceDto.price,
                type,
                hotelId
            ]);
            return {
                status: 200,
                message: "Successfully",
            };
        }
        catch (error) {
            console.error('Error when update price for rooms:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error. Please try again later.',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUseFlexiblePrice(hotelId, type, isUse) {
        try {
            const queryRunner = this.dataSource.createQueryRunner();
            const res = await queryRunner.manager.query(`
            UPDATE room_type
            SET "useFlexiblePrice" = $1
            WHERE "hotelId" = $2 AND type = $3
        `, [isUse, hotelId, type]);
            queryRunner.release();
            return {
                status: 200,
                message: "Successfully"
            };
        }
        catch (error) {
            console.error('Error when set price for rooms:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error. Please try again later.',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateNumOfRoomType(num, type, hotelId) {
        try {
            const queryRunner = this.dataSource.createQueryRunner();
            const res = await queryRunner.manager.query(`
            UPDATE room_type
            SET nums = nums + $1
            WHERE "hotelId" = $2 AND type = $3
        `, [num, hotelId, type]);
            queryRunner.release();
            return res;
        }
        catch (error) {
            console.error('Error when set price for rooms:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error. Please try again later.',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRoomTypeByHotelId(hotelId) {
        const queryRunner = this.dataSource.createQueryRunner();
        const roomtypes = await queryRunner.manager.query(`
        SELECT *
        FROM room_type
        WHERE "hotelId" = $1    
    `, [hotelId]);
        queryRunner.release();
        return roomtypes;
    }
    async applyWeekendPrice() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.manager.query(`
        UPDATE room_type
        SET price = "weekend_price"
    `);
        queryRunner.release();
    }
    async resetNormalPrice() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.manager.query(`
        UPDATE room_type
        SET price = "normalPrice"
    `);
    }
};
exports.RoomTypeService = RoomTypeService;
exports.RoomTypeService = RoomTypeService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(room_type_entity_1.RoomType)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository])
], RoomTypeService);
//# sourceMappingURL=room_type.service.js.map