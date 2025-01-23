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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./module/user/users.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const typeorm_2 = require("typeorm");
const hotels_module_1 = require("./module/hotel/hotels.module");
const rooms_module_1 = require("./module/room/rooms.module");
const locations_module_1 = require("./module/location/locations.module");
const review_module_1 = require("./module/review/review.module");
const payment_module_1 = require("./module/payment/payment.module");
const booking_module_1 = require("./module/booking/booking.module");
const auth_module_1 = require("./auth/auth.module");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./auth/guard/jwt-auth.guard");
const mailer_1 = require("@nestjs-modules/mailer");
const mail_module_1 = require("./mail/mail.module");
const bill_module_1 = require("./module/bill/bill.module");
const report_module_1 = require("./module/report/report.module");
const service_module_1 = require("./module/service/service.module");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const path_1 = require("path");
const role_module_1 = require("./module/role/role.module");
const image_module_1 = require("./module/image/image.module");
const minio_service_1 = require("./minio/minio.service");
const room_type_module_1 = require("./module/room_type/room_type.module");
const booking_detail_module_1 = require("./module/booking_detail/booking_detail.module");
const booking_room_module_1 = require("./module/booking_room/booking_room.module");
const schedule_1 = require("@nestjs/schedule");
const DailyCheckService_1 = require("./helpers/DailyCheckService");
const role_guard_1 = require("./auth/guard/role.guard");
let AppModule = class AppModule {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    configure(consumer) {
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.development']
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    type: 'postgres',
                    host: configService.get('DATABASE_HOST'),
                    port: configService.get('DATABASE_PORT'),
                    username: configService.get('DATABASE_USERNAME'),
                    password: configService.get('DATABASE_PASSWORD'),
                    database: configService.get('DATABASE_NAME'),
                    autoLoadEntities: true,
                    synchronize: false,
                    logging: ['query', 'error'],
                    extra: {
                        max: 10,
                        min: 0,
                        idleTimeoutMillis: 10000,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    transport: {
                        host: configService.get('MAILDEV_HOST'),
                        port: configService.get('MAILDEV_PORT'),
                        ignoreTLS: true,
                        secure: true,
                        auth: {
                            user: configService.get('MAILDEV_USER'),
                            pass: configService.get('MAILDEV_PASSWORD')
                        },
                    },
                    defaults: {
                        from: '"No Reply"',
                    },
                    template: {
                        dir: (0, path_1.join)(__dirname, '..', 'mail/templates'),
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    }
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            hotels_module_1.HotelsModule,
            rooms_module_1.RoomsModule,
            locations_module_1.LocationsModule,
            review_module_1.ReviewModule,
            payment_module_1.PaymentModule,
            booking_module_1.BookingModule,
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            bill_module_1.BillModule,
            report_module_1.ReportModule,
            service_module_1.ServiceModule,
            role_module_1.RoleModule,
            image_module_1.ImageModule,
            room_type_module_1.RoomTypeModule,
            booking_detail_module_1.BookingDetailModule,
            booking_room_module_1.BookingRoomModule,
            schedule_1.ScheduleModule.forRoot()
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard
            },
            {
                provide: core_1.APP_GUARD,
                useClass: role_guard_1.RolesGuard
            },
            minio_service_1.MinioService,
            DailyCheckService_1.DailyCheckService
        ],
    }),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], AppModule);
//# sourceMappingURL=app.module.js.map