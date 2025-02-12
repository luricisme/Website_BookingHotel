import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ChildEntity, Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from '../hotel/entities/hotel.entity';
import { Room } from '../room/entities/room.entity';
import { RoomType } from '../room_type/entites/room_type.entity';
import { MinioService } from '@/minio/minio.service';
import { User } from '../user/entities/user.entity';
import { Request, Response } from 'express';
import { BookingDetail } from '../booking_detail/entities/booking_detail.entity';
import { BookingRoom } from '../booking_room/entities/booking_room.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Discount } from '../discount/entities/discount.entity';
import axios from 'axios';
import * as crypto from 'crypto';
import { RedisService } from '../../redis/redis.service';
import { Cron } from '@nestjs/schedule';
import { AddInformationDto } from './dto/add-information.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(BookingDetail)
    private readonly bookingDetailRepository: Repository<BookingDetail>,

    @InjectRepository(BookingRoom)
    private readonly bookingRoomRepository: Repository<BookingRoom>,

    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,

    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,

    private readonly minioService: MinioService,

    private readonly redisService: RedisService,
  ) { }

  // Bắt đầu quá trình booking
  async create(
    createBookingDto: CreateBookingDto,
  ) {
    try {
      const {
        hotelId,
        checkInDate,
        checkOutDate,
        roomType2, // Số lượng phòng 2
        roomType4, // Số lượng phòng 4
        userId,
      } = createBookingDto;

      // Lấy ra danh sách phòng đang trống của khách sạn
      const availableRoomQuery = await this.roomRepository
        .createQueryBuilder('room')
        .leftJoin('room.hotel', 'hotel')
        .select([
          'room.id AS id',
          'room.name AS name',
          'room.type AS type',
          'room.status AS status',
          'room.hotelId AS hotelid',
        ])
        .where('hotel.id = :hotelId', { hotelId })
        .andWhere('room.status = :status', { status: 'available' });
      const availableRoom = await availableRoomQuery.getRawMany();
      console.log('AVAILABLE ROOMS: ', availableRoom);

      // Lấy ra danh sách phòng đang được đặt nhưng có ngày không trùng với lại ngày đặt của người khác
      const canBookingQuery = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.bookingRooms', 'bookingRoom')
        .leftJoin('bookingRoom.room', 'room')
        .where('booking.hotelId = :hotelId', { hotelId })
        .andWhere(
          '(booking.checkinTime >= :checkOutDate OR booking.checkoutTime <= :checkInDate)',
          {
            checkInDate,
            checkOutDate,
          },
        )
        .select([
          'room.id AS id',
          'room.name AS name',
          'room.type AS type',
          'room.status AS status',
          'room.hotelId AS hotelid',
        ]);

      const canBooking = await canBookingQuery.getRawMany();
      // console.log('CAN BOOKING: ', canBooking);
      const rooms = [...availableRoom, ...canBooking];
      // console.log('ALL AVAILABLE ROOMS: ', rooms);
      // Lấy ra phòng loại 2 và 4
      const roomsType2 = rooms.filter((room) => room.type === 2);
      const roomsType4 = rooms.filter((room) => room.type === 4);

      const getRandomRooms = (roomsList: any[], count: number) => {
        const shuffled = roomsList.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };
      // Lấy random ra số lượng phòng cho khách hàng
      const randomRoomsType2 = getRandomRooms(roomsType2, roomType2);
      const randomRoomsType4 = getRandomRooms(roomsType4, roomType4);
      const selectedRooms = [...randomRoomsType2, ...randomRoomsType4];
      // console.log('SELECTED ROOMS: ', selectedRooms);

      const roomIds = selectedRooms.map((room) => room.id);
      if (!roomIds || roomIds.length === 0) {
        throw new BadRequestException('No room IDs provided');
      }
      await this.roomRepository
        .createQueryBuilder()
        .update()
        .set({ status: 'pending' })
        .where('id IN (:...roomIds)', { roomIds })
        .execute();

      // Query roomType để lấy ra giá tiền và tính toán giá tiền 
      const roomTypeQuery = await this.roomTypeRepository
        .createQueryBuilder('roomType')
        .select(['roomType.type AS type',
          'roomType.price AS price',
          'roomType.weekend_price AS weekend_price'])
        .where('roomType.hotelId = :hotelId', { hotelId })
      const roomType = await roomTypeQuery.getRawMany();
      // console.log('ROOMTYPE: ', roomType);

      const room4 = roomType.filter(room => room.type === 4)[0] || null;
      // console.log('ROOM4: ', room4);
      const room2 = roomType.filter(room => room.type === 2)[0] || null;
      // console.log('ROOM2: ', room2);

      const totalRoom2 = await this.calculateTotalPrice(room2, roomType2, checkInDate, checkOutDate);
      // console.log('TOTAL ROOM 2: ', totalRoom2);
      const totalRoom4 = await this.calculateTotalPrice(room4, roomType4, checkInDate, checkOutDate);
      // console.log('TOTAL ROOM 4: ', totalRoom4);
      const sumPrice = totalRoom2 + totalRoom4;

      const bookingData = {
        hotelId,
        userId,
        checkInDate,
        checkOutDate,
        roomType2,
        type2Price: room2.price,
        type2WeekendPrice: room2.weekend_price,
        roomType4,
        type4Price: room4.price,
        tye4WeekendPrice: room4.weekend_price,
        sumPrice,
        rooms: selectedRooms,
        createdAt: Date.now(),
      };
      // console.log('BOOKING DATA: ', bookingData);
      // res.cookie('bookingData', JSON.stringify(bookingData), {
      //   maxAge: 5 * 60 * 1000,
      //   httpOnly: true,
      // });

      await this.redisService.set(`bookingData:${userId}`, bookingData, 300);

      const oldState = {
        hotelId,
        availableRoom,
        canBooking,
      };
      // console.log('OLD STATE: ', oldState);
      // res.cookie('oldState', JSON.stringify(oldState), {
      //   maxAge: 6 * 60 * 1000,
      //   httpOnly: true,
      // });
      await this.redisService.set(`oldState:${userId}`, oldState, 360);

      return {
        message: 'Booking data and old state saved to redis',
        bookingData,
      };
    } catch (error) {
      console.error('Error booking hotels:', error);

      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async calculateTotalPrice(room, numRooms, checkInDate, checkOutDate) {
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    let totalPrice = 0;

    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay(); // 0: Chủ Nhật, 6: Thứ Bảy

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        totalPrice += room.weekend_price * numRooms; // Giá cuối tuần * số lượng phòng
      } else {
        totalPrice += room.price * numRooms; // Giá ngày thường * số lượng phòng
      }
    }

    return totalPrice;
  }

  // Kiểm tra xem booking còn hạn không
  async checkBooking(req: Request) {
    try {
      const user = req.user as any;
      // console.log('USER: ', user);
      const userId = user.id;
      // console.log('USER ID: ', userId);
      if (!userId) {
        throw new HttpException(
          {
            status_code: HttpStatus.UNAUTHORIZED,
            message: 'User is not authenticated',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const redisKey = `bookingData:${userId}`;
      // console.log('🔍 Checking Redis Key:', redisKey);
      const bookingData = await this.redisService.get(redisKey);
      // console.log('📌 Redis GET Result:', bookingData);
      // Kiểm tra xem redis bookingData còn hạn không
      if (!bookingData) {
        const oldState = await this.redisService.get(`oldState:${userId}`);
        if (!oldState) {
          throw new HttpException(
            {
              status_code: HttpStatus.NOT_FOUND,
              message: 'Old state data not found in Redis',
            },
            HttpStatus.NOT_FOUND,
          );
        }
        const { hotelId, availableRoom, canBooking } = oldState;

        // Lấy danh sách ID từ availableRoom và canBooking
        const availableRoomIds = availableRoom.map((room) => room.id);
        const canBookingIds = canBooking.map((room) => room.id);

        // Cập nhật trạng thái "booked" cho các phòng trong canBooking
        if (canBookingIds.length > 0) {
          await this.roomRepository
            .createQueryBuilder()
            .update()
            .set({ status: 'booked' })
            .where('hotelId = :hotelId AND id IN (:...ids)', {
              hotelId,
              ids: canBookingIds,
            })
            .execute();
        }

        // Cập nhật trạng thái "available" cho các phòng trong availableRoom
        if (availableRoomIds.length > 0) {
          await this.roomRepository
            .createQueryBuilder()
            .update()
            .set({ status: 'available' })
            .where('hotelId = :hotelId AND id IN (:...ids)', {
              hotelId,
              ids: availableRoomIds,
            })
            .execute();
        }

        // Trả về lỗi phù hợp
        throw new HttpException(
          {
            status_code: HttpStatus.FORBIDDEN,
            message: 'Booking data has expired or not found',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      return {
        status_code: HttpStatus.OK,
        message: 'Booking data is valid',
        bookingData,
      };
    } catch (error) {
      console.error('Error checking booking:', error);
    }
  }

  @Cron('*/1 * * * *') // Chạy mỗi 1 phút
  async autoResetRoomStatus() {
    console.log('🔄 Running cron job to reset room status...');

    try {
      const keys = await this.redisService.keys('oldState:*'); // Lấy tất cả key oldState:userId
      for (const key of keys) {
        const userId = key.split(':')[1]; // Lấy userId từ key Redis

        // Kiểm tra xem bookingData có còn tồn tại không
        const bookingData = await this.redisService.get(`bookingData:${userId}`);
        if (bookingData) {
          console.log(`⏳ Booking still active for user ${userId}, skipping reset.`);
          continue; // Nếu bookingData vẫn còn, bỏ qua user này
        }

        // Nếu bookingData không còn => Lấy oldState để reset trạng thái phòng
        const oldState = await this.redisService.get(key);
        if (!oldState) continue;

        const { hotelId, availableRoom, canBooking } = oldState;

        const availableRoomIds = availableRoom.map((room) => room.id);
        const canBookingIds = canBooking.map((room) => room.id);

        // Cập nhật trạng thái "booked" cho canBooking
        if (canBookingIds.length > 0) {
          await this.roomRepository
            .createQueryBuilder()
            .update()
            .set({ status: 'booked' })
            .where('hotelId = :hotelId AND id IN (:...ids)', {
              hotelId,
              ids: canBookingIds,
            })
            .execute();
        }

        // Cập nhật trạng thái "available" cho availableRoom
        if (availableRoomIds.length > 0) {
          await this.roomRepository
            .createQueryBuilder()
            .update()
            .set({ status: 'available' })
            .where('hotelId = :hotelId AND id IN (:...ids)', {
              hotelId,
              ids: availableRoomIds,
            })
            .execute();
        }

        // Xóa key Redis sau khi cập nhật xong
        await this.redisService.del(key);
        console.log(`✅ Reset status for user ${userId}`);
      }
    } catch (error) {
      console.error('❌ Error in autoResetRoomStatus cron job:', error);
    }
  }

  // Lấy ra thông tin để hiển thị
  async getInformation(req: Request) {
    try {
      const userLogin = req.user as any;
      const userId = userLogin.id;

      const redisKey = `bookingData:${userId}`;
      console.log('🔍 Checking Redis Key:', redisKey);
      const bookingData = await this.redisService.get(redisKey);
      if (!bookingData) {
        throw new HttpException(
          'Booking data not found in cookies',
          HttpStatus.NOT_FOUND,
        );
      }
      console.log('📌 Redis GET Result:', bookingData);

      // Lấy ra thông tin hotel
      const hotelId = bookingData.hotelId;
      const hotelQuery = await this.hotelRepository
        .createQueryBuilder('hotel')
        .leftJoinAndSelect('hotel.locations', 'location')
        .select([
          'hotel.id AS id',
          'hotel.star AS star',
          'hotel.name AS name',
          'location.detailAddress AS address',
        ])
        .where('hotel.id = :hotelId', { hotelId });
      const hotel = await hotelQuery.getRawOne();
      // console.log('HOTEL: ', hotel);

      // Lấy ra thông tin người dùng
      const userQuery = await this.userRepository
        .createQueryBuilder('user')
        .select([
          'user.name AS name',
          'user.email AS email',
          'user.phone AS phone',
        ])
        .where('user.id = :userId', { userId });
      const user = await userQuery.getRawOne();
      // console.log('USER: ', user);

      // Lấy ra các discount của khách sạn đó
      const discountQuery = await this.discountRepository
        .createQueryBuilder('discount')
        .where('discount.hotelId = :hotelId', { hotelId })
        .andWhere('discount.status = :status', { status: 'active' });
      const discount = await discountQuery.getRawMany();
      console.log('DISCOUNT: ', discount);

      const data = {
        hotel: hotel,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        roomType2: bookingData.roomType2,
        type2Price: bookingData.type2Price,
        roomType4: bookingData.roomType4,
        type4Price: bookingData.type4Price,
        sumPrice: bookingData.sumPrice,
        discount: discount,
        user: user,
      };

      return {
        message: 'Get information from cookie successfully',
        data,
      };
    } catch (error) {
      console.error('Error booking hotels:', error);

      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Thêm note
  async addInformation(req: Request, addInformation: AddInformationDto) {
    try {
      const { note, totalPrice } = addInformation;
      console.log('NOTE: ', note);
      console.log('TOTAL PRICE: ', totalPrice);

      const userLogin = req.user as any;
      const userId = userLogin.id;

      await this.redisService.set(`notes:${userId}`, note, 300);

      const discountData = {
        totalPrice
      }

      await this.redisService.set(`discounts:${userId}`, discountData, 300);
      return {
        message: 'Note added successfully to note redis',
        note,
        totalPrice
      };
    } catch (error) {
      console.error('Error add note:', error);

      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Áp dụng discount
  async applyDiscount(req: Request, id_discount: number, oldSumPrice: number) {
    try {
      const userLogin = req.user as any;
      const userId = userLogin.id;

      const discountQuery = await this.discountRepository
        .createQueryBuilder('discount')
        .where('discount.id = :id_discount', { id_discount });
      const discount = await discountQuery.getRawOne();
      console.log('APPLIED DISCOUNT: ', discount);

      const value = discount.discount_value;
      const type = discount.discount_type;
      console.log('DISCOUNT VALUE: ', value);
      let totalPrice = oldSumPrice;
      let discountAmount = 0;
      if (type === 'percentage') {
        discountAmount = value * oldSumPrice / 100;
      } else if (type === 'fix amount') {
        discountAmount = value;
      }
      console.log('DISCOUNT AMOUNT: ', discountAmount);
      totalPrice = oldSumPrice - discountAmount;

      const discountData = {
        id_discount,
        totalPrice
      }

      await this.redisService.set(`discounts:${userId}`, discountData, 300);
      return {
        message: 'New sum price added successfully to discount redis',
        discountAmount,
        totalPrice
      };
    } catch (error) {
      console.error('Error apply discount:', error);

      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Kết thúc quá trình booking
  async processPayment(req: Request, res: Response, paymentMethod) {
    try {
      const userLogin = req.user as any;
      const userId = userLogin.id;
      console.log('USER ID: ', userId);

      const bookingData = await this.redisService.get(`bookingData:${userId}`);
      console.log('BOOKING DATA: ', bookingData);
      const note = await this.redisService.get(`notes:${userId}`);
      console.log('NOTE: ', note);
      const discount = await this.redisService.get(`discounts:${userId}`);
      console.log('DISCOUNT: ', discount);

      if (!bookingData || !note || !discount) {
        throw new HttpException(
          'Booking data not found in redis',
          HttpStatus.NOT_FOUND,
        );
      }

      if (paymentMethod === 'cash') {
        const paymentStatus = 'unpaid';
        const bookingStatus = 'confirmed';

        await this.saveDataIntoDatabase(
          bookingData,
          discount,
          paymentStatus,
          bookingStatus,
          note,
          paymentMethod,
        );
        await this.redisService.del(`bookingData:${userId}`);
        await this.redisService.del(`notes:${userId}`);
        await this.redisService.del(`discounts:${userId}`);
        return res.status(HttpStatus.OK).json({
          status_code: HttpStatus.OK,
          message: 'Cash successful, information saved to database.',
        });
      } else if (paymentMethod === 'momo') {
        const orderInfo = `Thanh toán đặt phòng khách sạn thông qua trang web đặt phòng BookAstay`;

        const paymentUrl = await this.createMomoPayment(
          res,
          orderInfo,
          bookingData,
          note,
          discount
        );
        console.log('Payment URL:', paymentUrl);
        return res.status(HttpStatus.OK).json({
          status_code: HttpStatus.OK,
          message: 'Redirect to MoMo for payment.',
          paymentUrl,
        });
      }

      // Trả về lỗi nếu phương thức thanh toán không hợp lệ
      throw new HttpException('Invalid payment method', HttpStatus.BAD_REQUEST);
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async createMomoPayment(
    res: Response,
    orderInfo: string,
    bookingData,
    note,
    discount
  ) {
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    var orderInfo = orderInfo;
    var partnerCode = 'MOMO';
    var redirectUrl = 'http://localhost:3000/reserve';
    var ipnUrl =
      'https://6bfc-113-185-82-137.ngrok-free.app/callback';
    var requestType = 'payWithMethod';
    var amount = discount.newSumPrice;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    const extraData = Buffer.from(
      JSON.stringify({ bookingData, note, discount }),
    ).toString('base64');

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;
    //puts raw signature
    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);
    //signature
    const crypto = require('crypto');
    var signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });

    // Option for axios
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    try {
      // Make HTTP request using axios
      const response = await axios(options);
      const result = response.data;

      if (result && result.payUrl) {
        return result.payUrl;
      } else {
        throw new Error('Failed to get payment URL from MoMo.');
      }
    } catch (error) {
      console.error(
        'Error creating MoMo payment:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Error creating MoMo payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePaymentStatus(req: Request, res: Response, body) {
    // console.log('BODY: ', body);
    const extraData = Buffer.from(body.extraData, 'base64').toString('utf-8');
    const { bookingData, note, discount } = JSON.parse(extraData);
    // console.log('NOTE: ', note);
    const resultCode = body.resultCode;
    if (resultCode === 0) {
      const paymentStatus = 'paid';
      const bookingStatus = 'confirmed';
      this.saveDataIntoDatabase(
        bookingData,
        discount,
        paymentStatus,
        bookingStatus,
        note,
        'momo',
      );
      return res.status(HttpStatus.OK).json({
        message: 'Payment success, save data into database',
        data: { paymentStatus, bookingData },
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Payment failed, please try again.',
      });
    }
  }

  private async saveBooking(bookingData: any, status: string, note: string) {
    try {
      const userId = bookingData.userId;
      const hotelId = bookingData.hotelId;
      const checkInDate = bookingData.checkInDate;
      const checkOutDate = bookingData.checkOutDate;
      const bookingQuery = await this.bookingRepository
        .createQueryBuilder()
        .insert()
        .into('booking')
        .values({
          user: { id: userId },
          hotel: { id: hotelId },
          checkinTime: checkInDate,
          checkoutTime: checkOutDate,
          status: status,
          note: note,
        })
        .returning('id')
        .execute();

      return bookingQuery.raw[0].id; // Trả về bookingId để sử dụng ở các bước tiếp theo
    } catch (error) {
      console.error('Error saving booking:', error);
      throw error;
    }
  }

  private async saveBookingDetail(bookingId: number, bookingData: any) {
    try {
      // console.log('BOOKING ID BEFORE QUERY: ', bookingId);
      // console.log('BOOKING DATA: ', bookingData);
      const bookingDetailQuery = await this.bookingDetailRepository
        .createQueryBuilder()
        .insert()
        .into(BookingDetail)
        .values([
          {
            booking: { id: bookingId },
            type: '2',
            nums: bookingData.roomType2,
            price: bookingData.type2Price,
          },
          {
            booking: { id: bookingId },
            type: '4',
            nums: bookingData.roomType4,
            price: bookingData.type4Price,
          },
        ])
        .execute();
    } catch (error) {
      console.error('Error saving booking detail:', error);
      throw error;
    }
  }

  private async saveBookingRoom(bookingId: number, bookingData: any) {
    try {
      const bookingRoomQuery = await this.bookingRoomRepository
        .createQueryBuilder()
        .insert()
        .into(BookingRoom)
        .values(
          bookingData.rooms.map((room) => ({
            booking: { id: bookingId },
            type: room.type,
            room_name: room.name,
            room: { id: room.id },
          })),
        )
        .execute();
    } catch (error) {
      console.error('Error saving booking detail:', error);
      throw error;
    }
  }

  private async createPayment(
    bookingId: number,
    bookingData: any,
    discount: any,
    paymentMethod: string,
    status: string,
  ) {
    try {
      const paymentQuery = await this.paymentRepository
        .createQueryBuilder()
        .insert()
        .into(Payment)
        .values({
          method: paymentMethod,
          status: status,
          booking: { id: bookingId },
          totalCost: discount.totalPrice,
        })
        .execute();
    } catch (error) {
      console.error('Error saving payment:', error);
      throw error;
    }
  }

  private async setStatusRoom(bookingData: any) {
    try {
      const hotelId = bookingData.hotelId;
      const rooms = bookingData.rooms;
      const roomIds = rooms.map((room) => room.id);
      if (roomIds.length > 0) {
        // Cập nhật trạng thái "booked" cho các phòng đã được đặt thành công
        await this.roomRepository
          .createQueryBuilder()
          .update()
          .set({ status: 'booked' })
          .where('hotelId = :hotelId AND id IN (:...ids)', {
            hotelId,
            ids: roomIds,
          })
          .execute();
      }
    } catch (error) {
      console.error('Error saving payment:', error);
      throw error;
    }
  }

  private async updateDiscount(discount: any) {
    try {
      const id_discount = discount.id_discount;

      if (id_discount) {
        await this.discountRepository
          .createQueryBuilder()
          .update('discounts')
          .set({ num: () => 'num - 1' }) // Giảm num đi 1
          .where('id = :id_discount', { id_discount })
          .execute();

        console.log(`Discount ID ${id_discount} updated successfully.`);
      }
    } catch (error) {
      console.error('Error updating discount:', error);
      throw error;
    }
  }

  private async saveDataIntoDatabase(
    bookingData: any,
    discount: any,
    paymentStatus: string,
    bookingStatus: string,
    note: string,
    paymentMethod: string,
  ) {
    try {
      const bookingId = await this.saveBooking(
        bookingData,
        bookingStatus,
        note,
      );
      // console.log('BOOKING ID: ', bookingId);
      await this.saveBookingDetail(bookingId, bookingData);
      await this.saveBookingRoom(bookingId, bookingData);
      await this.setStatusRoom(bookingData);
      await this.createPayment(
        bookingId,
        bookingData,
        discount,
        paymentMethod,
        paymentStatus,
      );
      await this.updateDiscount(discount);
    } catch (error) {
      console.error('Error saving data into database:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error while saving all data.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(getBookingDto) {
    try {
      const { userId, page, per_page } = getBookingDto;

      const hotelQuery = await this.hotelRepository
        .createQueryBuilder('hotel')
        .select(['hotel.id AS id'])
        .where('hotel.ownerId = :userId', { userId: userId });

      const hotel = await hotelQuery.getRawOne();
      if (!hotel) {
        throw new Error('No hotel found for the given ownerId');
      }
      const hotelId = hotel.id;

      const bookingQuery = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.user', 'user')
        .leftJoin('booking.payment', 'payment')
        .select([
          'booking.id AS id',
          'user.name AS name',
          'booking.checkinTime AS "checkInDate"',
          'booking.checkoutTime AS "checkOutDate"',
          'booking.status AS status',
          'payment."totalCost" AS "totalPrice"',
        ])
        .where('booking."hotelId" = :hotelId', { hotelId: hotelId })
        .orderBy('booking.createdAt', 'DESC');

      const offset = (page - 1) * per_page;

      // Áp dụng skip và take trước khi lấy kết quả
      bookingQuery.limit(per_page).offset(offset);

      const [bookings, totalBookings] = await Promise.all([
        bookingQuery.getRawMany(),
        bookingQuery.getCount(),
      ]);
      const totalPages = Math.ceil(totalBookings / per_page);

      return {
        status_code: HttpStatus.OK,
        message: 'Booking data fetched successfully',
        data: {
          total: totalBookings,
          page: Number(page),
          total_page: totalPages,
          per_page: Number(per_page),
          bookings,
        },
      };
    } catch (error) {
      console.error('Error saving data into database:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error while saving all data.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDetail(viewDetailBookingDto) {
    try {
      const { userId, bookingId, page, per_page } = viewDetailBookingDto;

      const userQuery = await this.userRepository
        .createQueryBuilder('user')
        .select([
          'user.name AS name',
          'user.email AS email',
          'user.phone AS phone',
        ])
        .where('user.id = :userId', { userId: userId });

      const user = await userQuery.getRawOne();
      if (!user) {
        throw new Error('No user found for the given userId');
      }

      const bookingQuery = await this.bookingRepository
        .createQueryBuilder('booking')
        .select(['booking.note AS note'])
        .where('booking.id = :bookingId', { bookingId });
      const booking = await bookingQuery.getRawOne();
      const note = booking.note;

      const bookingRoomQuery = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.bookingRooms', 'booking_room')
        .leftJoin('booking.bookingDetails', 'booking_detail')
        .select([
          'booking.id AS id',
          'booking_room.room_name AS name',
          'booking_room.type AS type',
          'booking_detail.price AS price',
        ])
        .where('booking.id = :bookingId', { bookingId })
        .andWhere('booking_detail.type = booking_room.type');

      const totalBookingRoomsQuery = this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.bookingRooms', 'booking_room')
        .leftJoin('booking.bookingDetails', 'booking_detail')
        .select('COUNT(*)', 'total')
        .where('booking.id = :bookingId', { bookingId })
        .andWhere('booking_detail.type = booking_room.type');

      const offset = (page - 1) * per_page;
      bookingRoomQuery.limit(per_page).offset(offset);

      // Thực thi cả hai truy vấn
      const [bookingRooms, totalBookingRoomsResult] = await Promise.all([
        bookingRoomQuery.getRawMany(),
        totalBookingRoomsQuery.getRawOne(),
      ]);

      // Đảm bảo lấy tổng số bản ghi chính xác
      const totalBookingRooms = totalBookingRoomsResult?.total || 0;
      const totalPages = Math.ceil(totalBookingRooms / per_page);

      return {
        status_code: HttpStatus.OK,
        message: 'Booking data fetched successfully',
        data: {
          total: Number(totalBookingRooms),
          page: Number(page),
          total_page: totalPages,
          per_page: Number(per_page),
          user,
          bookingRooms,
          note,
        },
      };
    } catch (error) {
      console.error('Error saving data into database:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error while saving all data.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStatusBooking(changeStatusBookingDto) {
    try {
      const { bookingId, status } = changeStatusBookingDto;
      const bookingRoomQuery = await this.bookingRoomRepository
        .createQueryBuilder('booking_room')
        .select('booking_room.roomId', 'roomId')
        .where('booking_room."bookingId" = :bookingId', { bookingId })
        .getRawMany();
      const roomIds = bookingRoomQuery.map((row) => row.roomId);
      console.log('ROOMIDS: ', roomIds);
      if (status === 'confirmed' && roomIds.length > 0) {
        await this.roomRepository
          .createQueryBuilder()
          .update()
          .set({ status: 'booked' })
          .where('id IN (:...roomIds)', { roomIds })
          .execute();
      } else if (
        (status === 'completed' || status === 'cancelled') &&
        roomIds.length > 0
      ) {
        await this.roomRepository
          .createQueryBuilder()
          .update()
          .set({ status: 'available' })
          .where('id IN (:...roomIds)', { roomIds })
          .execute();
      }

      await this.bookingRepository
        .createQueryBuilder()
        .update()
        .set({ status })
        .where('id = :bookingId', { bookingId })
        .execute();
      return {
        status_code: HttpStatus.OK,
        message: `Booking status successfully updated to ${status}.`,
      };
    } catch (error) {
      console.error('Error saving data into database:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error while saving all data.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllHistoryBooking(req: Request, getAllHistoryBooking) {
    try {
      const { userId, page, per_page } = getAllHistoryBooking;
      const bookingQuery = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.hotel', 'hotel')
        .leftJoin('booking.payment', 'payment')
        .select([
          'booking.id AS id',
          'booking.createdAt AS created', // Thêm dấu ngoặc kép
          'hotel.name AS name',
          'payment.totalCost AS totalcost', // Thêm dấu ngoặc kép
          'booking.status AS status',
        ])
        .where('booking.userId = :userId', { userId: userId });

      const offset = (page - 1) * per_page;
      bookingQuery.limit(per_page).offset(offset);

      const [bookings, totalBookings] = await Promise.all([
        bookingQuery.getRawMany(),
        bookingQuery.getCount(),
      ]);
      const totalPages = Math.ceil(totalBookings / per_page);

      // Kiểm tra cookie 'bookingData'
      const bookingDT = req.cookies['bookingData'];
      let tempBooking = null;

      if (bookingDT) {
        const bookingData = JSON.parse(bookingDT);

        const hotelId = bookingData.hotelId;
        const hotelQuery = await this.hotelRepository
          .createQueryBuilder('hotel')
          .select(['hotel.name AS name'])
          .where('hotel.id = :hotelId', { hotelId });
        const hotel = await hotelQuery.getRawOne();

        tempBooking = {
          hotelId: hotelId,
          totalCost: bookingData.sumPrice,
          createAt: bookingData.createAt,
          hotelName: hotel.name,
          status: 'Pending',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully fetched booking history.',
        data: {
          tempBooking,
          total: totalBookings,
          page: page,
          total_page: totalPages,
          bookings,
        },
      };
    } catch (error) {
      console.error('Error get history:', error);
      throw new HttpException(
        {
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error while get data.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async totalReservation(id: number) {
    try {
      const today = new Date();
      const todayDate = today.toISOString().split('T')[0];

      const count = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.hotel', 'hotel')
        .where('booking.hotelId = :hotelId', { hotelId: id })
        .andWhere('hotel.status = :status', { status: 'booked' })
        .andWhere('DATE(booking.checkinTime) <= :today', { today: todayDate })
        .andWhere('DATE(booking.checkoutTime) >= :today', { today: todayDate })
        .getCount();

      return {
        status: 200,
        hotelId: id,
        total: count,
      };
    } catch (error) {
      throw new Error(`Error fetching total occupied rooms: ${error.message}`);
    }
  }

  async totalcheckIn(id: number) {
    try {
      const today = new Date();
      const todayDate = today.toISOString().split('T')[0];

      const count = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.hotel', 'hotel')
        .where('booking.hotelId = :hotelId', { hotelId: id })
        .andWhere('hotel.status = :status', { status: 'booked' })
        .andWhere('DATE(booking.checkinTime) = :today', { today: todayDate })
        .getCount();

      return {
        status: 200,
        hotelId: id,
        total: count,
      };
    } catch (error) {
      throw new Error(`Error fetching total occupied rooms: ${error.message}`);
    }
  }

  async totalcheckOut(id: number) {
    try {
      const today = new Date();
      const todayDate = today.toISOString().split('T')[0];

      const count = await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoin('booking.hotel', 'hotel')
        .where('booking.hotelId = :hotelId', { hotelId: id })
        .andWhere('hotel.status = :status', { status: 'booked' })
        .andWhere('DATE(booking.checkoutTime) = :today', { today: todayDate })
        .getCount();

      return {
        status: 200,
        hotelId: id,
        total: count,
      };
    } catch (error) {
      throw new Error(`Error fetching total occupied rooms: ${error.message}`);
    }
  }
}
