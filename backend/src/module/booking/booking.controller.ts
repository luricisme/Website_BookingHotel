import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpCode, HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { GetBookingDto } from './dto/get-booking.dto';
import { ViewDetailBookingDto } from './dto/view-detail-booking.dto';
import { ChangeStatusBookingDto } from './dto/change-status-booking.dto';
import { Public } from '@/helpers/decorator/public';
import { GetHistoryBookingDto } from './dto/get-history-booking.dto';
import { AddInformationDto } from './dto/add-information.dto';
import { Roles } from '@/helpers/decorator/roles';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  // BOOKING
  // [POST]: /booking/start
  @Post('start')
  @Roles("user")
  async startBooking(
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return await this.bookingService.create(createBookingDto);
  }

  // [GET]: /booking/check-booking --> Kiểm tra booking còn hạn không
  // Đối với người đã đăng nhập thì có thể trở lại
  @Get('check-booking')
  @Roles("user")
  async check(
    @Req() req
  ) {
    return await this.bookingService.checkBooking(req);
  }

  // [GET]: /booking/information
  @Get('information')
  @Roles("user")
  async getInformation(
    @Req() req
  ) {
    return await this.bookingService.getInformation(req);
  }

  // [POST]: /booking/apply-discount
  @Post('apply-discount')
  @Roles("user")
  async applyDiscount(
    @Req() req,
    @Body() body
  ) {
    const id_discount = Number(body.id_discount);
    const oldSumPrice = parseFloat(body.oldSumPrice);
    return await this.bookingService.applyDiscount(req, id_discount, oldSumPrice);
  }

  // [POST]: /booking/information
  @Post('information')
  @Roles("user")
  async addInformation(
    @Req() req,
    @Body() addInformationDto: AddInformationDto
  ) {
    return await this.bookingService.addInformation(req, addInformationDto);
  }
  
  // [POST]: /booking/finish
  @Post('finish')
  @Roles("user")
  async finishBooking(
    @Body() body: { paymentMethod: string },
    @Req() req,
  ) {
    const paymentMethod = body.paymentMethod;
    return await this.bookingService.processPayment(req, paymentMethod);
  }

  // HOTEL - CONTROL 
  // [GET]: /booking/guest?userId=...&page=...&per_page=...
  @Get('guest')
  @Roles("hotelier")
  async getAllBooking(
    @Query() getBookingDto: GetBookingDto
  ) {
    return this.bookingService.findAll(getBookingDto);
  }

  // [GET]: /booking/guest/detail?userId=...&bookingId=...&page=...&per_page=...
  @Get('guest/detail')
  @Roles("hotelier", "user")
  async getDetailBooking(
    @Query() viewDetailBookingDto: ViewDetailBookingDto
  ) {
    return this.bookingService.getDetail(viewDetailBookingDto);
  }

  // [PATCH]: /booking/guest/update-status?bookingId=...?status='confirmed' || 'canceled' || 'completed'
  @Patch('guest/update-status')
  @Roles("hotelier", "user")
  async updateStatus(@Query() changeStatusBookingDto: ChangeStatusBookingDto
  ) {
    return await this.bookingService.updateStatusBooking(changeStatusBookingDto);
  }

  // HISTORY
  @Get('history')
  @Roles("user", "hotelier")
  async getAllHistory(
    @Query() getHistoryBookingDto: GetHistoryBookingDto,
    @Req() req,
  ) {
    return await this.bookingService.getAllHistoryBooking(req, getHistoryBookingDto);
  }

  // Room (Reservation)
  @Get('total/r/:id')
  @Roles("hotelier")
  async getTotalResservation(@Param('id') id: number) {
    return await this.bookingService.totalReservation(id);
  }

  // Room (checkin)
  @Get('total/i/:id')
  @Roles("hotelier")
  async getTotalCheckIn(@Param('id') id: number) {
    return await this.bookingService.totalcheckIn(id);
  }

  // Room (checkout)
  @Get('total/o/:id')
  @Roles("hotelier")
  async getTotalCheckOut(@Param('id') id: number) {
    return await this.bookingService.totalcheckOut(id);
  }
}