"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const bill_controller_1 = require("./bill.controller");
const bill_service_1 = require("./bill.service");
describe('BillController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [bill_controller_1.BillController],
            providers: [bill_service_1.BillService],
        }).compile();
        controller = module.get(bill_controller_1.BillController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=bill.controller.spec.js.map