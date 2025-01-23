"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bill_entity_1 = require("./src/module/bill/entities/bill.entity");
const booking_entity_1 = require("./src/module/booking/entities/booking.entity");
const booking_detail_entity_1 = require("./src/module/booking_detail/entities/booking_detail.entity");
const booking_room_entity_1 = require("./src/module/booking_room/entities/booking_room.entity");
const hotel_entity_1 = require("./src/module/hotel/entities/hotel.entity");
const image_entity_1 = require("./src/module/image/entities/image.entity");
const location_entity_1 = require("./src/module/location/entities/location.entity");
const payment_entity_1 = require("./src/module/payment/entities/payment.entity");
const report_entity_1 = require("./src/module/report/entities/report.entity");
const review_entity_1 = require("./src/module/review/entities/review.entity");
const role_entity_1 = require("./src/module/role/entities/role.entity");
const room_entity_1 = require("./src/module/room/entities/room.entity");
const room_type_entity_1 = require("./src/module/room_type/entites/room_type.entity");
const service_entity_1 = require("./src/module/service/entities/service.entity");
const user_entity_1 = require("./src/module/user/entities/user.entity");
const typeorm_1 = require("typeorm");
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: "88.222.212.40",
    port: 5432,
    username: "bookastaydata",
    password: "bookastaydata",
    database: "bookastay",
    migrations: ["./migrations/**"],
    entities: [user_entity_1.User, bill_entity_1.Bill, booking_entity_1.Booking, hotel_entity_1.Hotel, location_entity_1.Location, payment_entity_1.Payment, report_entity_1.Report, review_entity_1.Review, room_entity_1.Room, service_entity_1.Service, image_entity_1.Image, role_entity_1.Role, room_type_entity_1.RoomType, booking_detail_entity_1.BookingDetail, booking_room_entity_1.BookingRoom],
});
//# sourceMappingURL=typeOrm.config.js.map