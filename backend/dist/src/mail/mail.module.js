"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("./mail.service");
const mail_controller_1 = require("./mail.controller");
const config_1 = require("@nestjs/config");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
let MailModule = class MailModule {
};
exports.MailModule = MailModule;
exports.MailModule = MailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['../../.env.development']
            }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    transport: {
                        host: configService.get('MAILDEV_HOST'),
                        port: configService.get('MAILDEV_PORT'),
                        ignoreTLS: true,
                        secure: true,
                        auth: {
                            user: configService.get('MAILDEV_USER'),
                            pass: configService.get('MAILDEV_PASSWORD')
                        },
                    },
                    defaults: {
                        from: '"No Reply"',
                    },
                    template: {
                        dir: process.cwd() + "/src/mail/templates",
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    }
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [mail_controller_1.MailController],
        providers: [mail_service_1.MailService],
        exports: [mail_service_1.MailService]
    })
], MailModule);
//# sourceMappingURL=mail.module.js.map