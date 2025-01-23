"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const image_controller_1 = require("./image.controller");
const image_service_1 = require("./image.service");
describe('ImageController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [image_controller_1.ImageController],
            providers: [image_service_1.ImageService],
        }).compile();
        controller = module.get(image_controller_1.ImageController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=image.controller.spec.js.map