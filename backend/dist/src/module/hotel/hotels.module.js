"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelsModule = void 0;
const common_1 = require("@nestjs/common");
const hotel_entity_1 = require("./entities/hotel.entity");
const hotels_service_1 = require("./hotels.service");
const hotels_controller_1 = require("./hotels.controller");
const typeorm_1 = require("@nestjs/typeorm");
const minio_service_1 = require("../../minio/minio.service");
const room_type_entity_1 = require("../room_type/entites/room_type.entity");
const room_type_module_1 = require("../room_type/room_type.module");
const room_entity_1 = require("../room/entities/room.entity");
const rooms_module_1 = require("../room/rooms.module");
const review_entity_1 = require("../review/entities/review.entity");
const review_module_1 = require("../review/review.module");
const image_module_1 = require("../image/image.module");
const locations_module_1 = require("../location/locations.module");
let HotelsModule = class HotelsModule {
};
exports.HotelsModule = HotelsModule;
exports.HotelsModule = HotelsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([hotel_entity_1.Hotel, room_type_entity_1.RoomType, room_entity_1.Room, review_entity_1.Review]),
            rooms_module_1.RoomsModule,
            review_module_1.ReviewModule,
            room_type_module_1.RoomTypeModule,
            image_module_1.ImageModule,
            locations_module_1.LocationsModule,
        ],
        controllers: [hotels_controller_1.HotelsController],
        providers: [hotels_service_1.HotelsService, minio_service_1.MinioService],
        exports: [hotels_service_1.HotelsService]
    })
], HotelsModule);
//# sourceMappingURL=hotels.module.js.map