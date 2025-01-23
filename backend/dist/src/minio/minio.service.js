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
exports.MinioService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Minio = require("minio");
let MinioService = class MinioService {
    constructor(configService) {
        this.configService = configService;
        this.minioClient = new Minio.Client({
            endPoint: configService.get('MINIO_ENDPOINT'),
            port: 9000,
            useSSL: false,
            accessKey: configService.get('MINIO_ACCESS_KEY'),
            secretKey: configService.get('MINIO_SECRET_KEY'),
        });
    }
    async uploadFile(bucketName, fileName, fileBuffer) {
        try {
            const exists = await this.minioClient.bucketExists(bucketName);
            if (!exists) {
                await this.minioClient.makeBucket(bucketName);
            }
            const objInfo = await this.minioClient.putObject(bucketName, fileName, fileBuffer);
            return objInfo.etag;
        }
        catch (error) {
            throw new Error(`Failed to upload file to MinIO: ${error.message}`);
        }
    }
    async getPresignedUrl(objectName) {
        const expires = 60 * 60;
        return this.minioClient.presignedUrl('GET', 'bookastay', objectName, expires);
    }
};
exports.MinioService = MinioService;
exports.MinioService = MinioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MinioService);
//# sourceMappingURL=minio.service.js.map