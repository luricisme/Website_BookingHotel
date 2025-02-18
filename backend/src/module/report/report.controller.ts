import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Public } from '@/helpers/decorator/public';
import { ResponseDto } from '@/helpers/utils';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
}
