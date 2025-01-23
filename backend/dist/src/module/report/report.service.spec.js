"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const report_service_1 = require("./report.service");
describe('ReportService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [report_service_1.ReportService],
        }).compile();
        service = module.get(report_service_1.ReportService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=report.service.spec.js.map