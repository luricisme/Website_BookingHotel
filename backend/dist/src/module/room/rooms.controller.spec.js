"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const rooms_controller_1 = require("./rooms.controller");
const rooms_service_1 = require("./rooms.service");
describe('RoomsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [rooms_controller_1.RoomsController],
            providers: [rooms_service_1.RoomsService],
        }).compile();
        controller = module.get(rooms_controller_1.RoomsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=rooms.controller.spec.js.map