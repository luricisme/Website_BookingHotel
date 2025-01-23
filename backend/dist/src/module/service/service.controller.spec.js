"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const service_controller_1 = require("./service.controller");
const service_service_1 = require("./service.service");
describe('ServiceController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [service_controller_1.ServiceController],
            providers: [service_service_1.ServiceService],
        }).compile();
        controller = module.get(service_controller_1.ServiceController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=service.controller.spec.js.map