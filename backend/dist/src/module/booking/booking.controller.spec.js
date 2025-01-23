"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const booking_controller_1 = require("./booking.controller");
const booking_service_1 = require("./booking.service");
describe('BookingController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [booking_controller_1.BookingController],
            providers: [booking_service_1.BookingService],
        }).compile();
        controller = module.get(booking_controller_1.BookingController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=booking.controller.spec.js.map