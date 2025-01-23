"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const report_controller_1 = require("./report.controller");
const report_service_1 = require("./report.service");
describe('ReportController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [report_controller_1.ReportController],
            providers: [report_service_1.ReportService],
        }).compile();
        controller = module.get(report_controller_1.ReportController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=report.controller.spec.js.map