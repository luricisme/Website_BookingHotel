import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { Hotel } from '../hotel/entities/hotel.entity';

@Injectable()
export class ReportService {
  constructor(
      @InjectRepository(Report)
      private readonly reportRepository: Repository<Report>,
  ) {}

}
