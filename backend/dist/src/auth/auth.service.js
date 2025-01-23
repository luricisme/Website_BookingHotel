"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../module/user/user.service");
const utils_1 = require("../helpers/utils");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('User does not exist');
        }
        let isValidPassword = await (0, utils_1.comparePassword)(pass, user.password);
        if (!isValidPassword) {
            throw new common_1.UnauthorizedException('Password is incorrect');
        }
        const { password, ...res } = user;
        return res;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.username };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }
    async refreshAccessToken(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            const payload = { email: decoded.email, sub: decoded.sub };
            const newAccessToken = this.jwtService.sign(payload);
            return { access_token: newAccessToken };
        }
        catch (error) {
        }
    }
    async loginWithGoogle(user) {
        const existed = await this.usersService.findByEmail(user.email);
        if (existed) {
            const payload = { email: user.email, sub: user.username };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
    }
    async register(createAuthDto, role) {
        const user = await this.usersService.registerUser(createAuthDto, role);
        this.mailService.sendUserActivation(user);
        return user;
    }
    async forgetPassword(email) {
        const user = await this.usersService.setupResetPassword(email);
        this.mailService.sendResetPassword(user);
        return user.codeId;
    }
    async resetPassword(resetInfo) {
        return await this.usersService.resetPassword(resetInfo);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map