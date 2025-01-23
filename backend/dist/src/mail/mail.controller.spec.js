"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const mail_controller_1 = require("./mail.controller");
const mail_service_1 = require("./mail.service");
describe('MailController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [mail_controller_1.MailController],
            providers: [mail_service_1.MailService],
        }).compile();
        controller = module.get(mail_controller_1.MailController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=mail.controller.spec.js.map