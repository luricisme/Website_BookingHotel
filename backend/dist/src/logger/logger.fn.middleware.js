"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = logger;
function logger(req, res, next) {
    console.log("Funtional Middleware");
    next();
}
//# sourceMappingURL=logger.fn.middleware.js.map