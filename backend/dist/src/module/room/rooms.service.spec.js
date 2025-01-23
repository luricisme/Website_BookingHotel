"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const rooms_service_1 = require("./rooms.service");
describe('RoomsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [rooms_service_1.RoomsService],
        }).compile();
        service = module.get(rooms_service_1.RoomsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=rooms.service.spec.js.map