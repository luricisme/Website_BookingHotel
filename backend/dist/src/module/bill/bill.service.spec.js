"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const bill_service_1 = require("./bill.service");
describe('BillService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [bill_service_1.BillService],
        }).compile();
        service = module.get(bill_service_1.BillService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=bill.service.spec.js.map