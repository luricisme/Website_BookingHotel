import { DataSource, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { MinioService } from '@/minio/minio.service';
import { ConfigService } from '@nestjs/config';
import { Hotel } from '../hotel/entities/hotel.entity';
export declare class ImageService {
    private dataSource;
    private readonly imageRepository;
    private readonly minioService;
    private readonly configService;
    constructor(dataSource: DataSource, imageRepository: Repository<Image>, minioService: MinioService, configService: ConfigService);
    uploadHotelImages(images: Express.Multer.File[], hotel: Hotel): Promise<any[]>;
}
