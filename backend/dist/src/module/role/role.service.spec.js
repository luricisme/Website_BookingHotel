"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const role_service_1 = require("./role.service");
describe('RoleService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [role_service_1.RoleService],
        }).compile();
        service = module.get(role_service_1.RoleService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=role.service.spec.js.map