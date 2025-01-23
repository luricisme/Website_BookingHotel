import { ConfigService } from '@nestjs/config';
export declare class MinioService {
    private readonly configService;
    private minioClient;
    constructor(configService: ConfigService);
    uploadFile(bucketName: string, fileName: string, fileBuffer: Buffer): Promise<string>;
    getPresignedUrl(objectName: string): Promise<string>;
}
