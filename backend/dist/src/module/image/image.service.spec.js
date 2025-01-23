"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const image_service_1 = require("./image.service");
describe('ImageService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [image_service_1.ImageService],
        }).compile();
        service = module.get(image_service_1.ImageService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=image.service.spec.js.map