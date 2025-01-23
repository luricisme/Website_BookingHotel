import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendUserActivation(user: any): Promise<void>;
    sendResetPassword(user: any): Promise<void>;
}
