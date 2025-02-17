import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Hotel } from '../hotel/entities/hotel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Hotel]),
],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
