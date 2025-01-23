"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const hashPassword = async (plainPassword) => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds);
    }
    catch (error) {
        console.log(error);
    }
};
exports.hashPassword = hashPassword;
const comparePassword = async (plainPassword, hashPassord) => {
    try {
        return await bcrypt.compare(plainPassword, hashPassord);
    }
    catch (error) {
        console.log(error);
    }
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=utils.js.map