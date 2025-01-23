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
exports.ImageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const image_entity_1 = require("./entities/image.entity");
const typeorm_2 = require("@nestjs/typeorm");
const minio_service_1 = require("../../minio/minio.service");
const config_1 = require("@nestjs/config");
let ImageService = class ImageService {
    constructor(dataSource, imageRepository, minioService, configService) {
        this.dataSource = dataSource;
        this.imageRepository = imageRepository;
        this.minioService = minioService;
        this.configService = configService;
    }
    async uploadHotelImages(images, hotel) {
        try {
            const bucketName = "bookastay";
            const minioServer = this.configService.get('MINIO_ENDPOINT');
            const imageObjects = [];
            const uploadPromises = images.map(async (image) => {
                const objectName = `hotel_images/${image.originalname}`;
                await this.minioService.uploadFile(bucketName, objectName, image.buffer);
                imageObjects.push({
                    url: `http://${minioServer}:9000/${bucketName}/${objectName}`,
                    hotel
                });
            });
            await Promise.all(uploadPromises);
            await this.imageRepository.insert(imageObjects);
            const imageUrls = imageObjects.map(object => object.url);
            return imageUrls;
        }
        catch (error) {
            throw new common_1.BadRequestException('error when upload hotel images');
        }
    }
};
exports.ImageService = ImageService;
exports.ImageService = ImageService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(image_entity_1.Image)),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        typeorm_1.Repository,
        minio_service_1.MinioService,
        config_1.ConfigService])
], ImageService);
//# sourceMappingURL=image.service.js.map