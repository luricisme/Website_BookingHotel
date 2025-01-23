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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("./entities/room.entity");
const room_type_service_1 = require("../room_type/room_type.service");
let RoomsService = class RoomsService {
    constructor(roomtypeService, dataSource, roomRepository) {
        this.roomtypeService = roomtypeService;
        this.dataSource = dataSource;
        this.roomRepository = roomRepository;
    }
    async create(createRoomDtos, hotelId) {
        try {
            const roomtypes = await this.roomtypeService.getRoomTypeByHotelId(hotelId);
            const roomtypeIds = roomtypes.map((roomtype) => roomtype.id);
            const rooms = createRoomDtos.map(room => ({
                name: room.name,
                type: room.type,
                status: 'available',
                hotelId: hotelId,
                roomType: { id: roomtypeIds[(room.type / 2) - 1] }
            }));
            const doubleRooms = rooms.filter(room => room.type === 2);
            const quadRooms = rooms.filter(room => room.type === 4);
            console.log(doubleRooms.length, quadRooms.length);
            const queryBuilder = await this.roomRepository.createQueryBuilder()
                .insert()
                .into('room')
                .values(rooms)
                .execute();
            if (doubleRooms.length > 0) {
                await this.roomtypeService.updateNumOfRoomType(doubleRooms.length, 2, +hotelId);
            }
            if (quadRooms.length > 0) {
                await this.roomtypeService.updateNumOfRoomType(quadRooms.length, 4, +hotelId);
            }
            return {
                status: 200,
                message: "Successfully",
                rooms: queryBuilder.raw.map(hotel => hotel.id)
            };
        }
        catch (error) {
            console.error('Error creating rooms:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll(hotelId, query) {
        try {
            const { page = 1, limit = 5, sortBy = 'id', order = 'ASC', searchTerm } = query;
            const take = limit;
            const [rooms, total] = await this.roomRepository.createQueryBuilder('room')
                .leftJoinAndSelect('room.hotel', 'hotel')
                .leftJoinAndSelect('room.roomType', 'roomType')
                .select(['room', 'roomType.price'])
                .where('room.hotelId = :hotelId', { hotelId })
                .take(limit)
                .skip((+page - 1) * +limit)
                .getManyAndCount();
            const res = rooms.map(room => ({
                id: room.id,
                name: room.name,
                type: room.type,
                price: room.roomType.price,
                status: room.status
            }));
            return {
                status: 200,
                message: "Successfully",
                data: {
                    all_page: Math.ceil(total / +limit),
                    total,
                    rooms: res
                }
            };
        }
        catch (error) {
            console.error('Error getting room by hotelid:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    findOne(id) {
        return `This action returns a #${id} room`;
    }
    update(id, updateRoomDto) {
        return `This action updates a #${id} room`;
    }
    async remove(id) {
        try {
            const res = await this.roomRepository.delete({ id });
            if (res.affected > 0) {
                return {
                    status: 200,
                    message: "Successfully"
                };
            }
            else {
                throw new common_1.BadRequestException("Error when delete room");
            }
        }
        catch (error) {
            console.error('Error delete room:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async totalOccupied(id) {
        try {
            const total = await this.roomRepository
                .createQueryBuilder('room')
                .innerJoin('room.hotel', 'hotel')
                .where('hotel.id = :hotelId', { hotelId: id })
                .andWhere('room.status = :status', { status: 'booked' })
                .getCount();
            return {
                status: 200,
                hotelId: id,
                total: total,
            };
        }
        catch (error) {
            throw new Error(`Error fetching total occupied rooms: ${error.message}`);
        }
    }
    async totalAvailable(id) {
        try {
            const total = await this.roomRepository
                .createQueryBuilder('room')
                .innerJoin('room.hotel', 'hotel')
                .where('hotel.id = :hotelId', { hotelId: id })
                .andWhere('room.status = :status', { status: 'available' })
                .getCount();
            return {
                status: 200,
                hotelId: id,
                total: total,
            };
        }
        catch (error) {
            throw new Error(`Error fetching total occupied rooms: ${error.message}`);
        }
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [room_type_service_1.RoomTypeService,
        typeorm_2.DataSource,
        typeorm_2.Repository])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map