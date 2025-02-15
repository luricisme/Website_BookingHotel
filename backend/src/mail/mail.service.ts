import { User } from '@/module/user/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { verify } from 'crypto';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

  async sendUserActivation(user: any, verifyToken: string) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>',
      subject: 'Activate your account',
      template: './verifyemail',
      context: {
        name: user.name,
        verifyUrl: `http://localhost:3001/api/auth/verify-email?token=${verifyToken}`
      },
    });
  }

  async sendResetPassword(user : any) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>',
      subject: 'Reset your password',
      template: './resetpass',
      context: {
        name: user.name,
        activationCode: user.codeId
      },
    });
  }

   async sendInvoice(email: string, bookingData: any, note: any, discount: any, paymentMethod: string){
      try{
        await this.mailerService.sendMail({
          to: email,
          subject: 'Confirm booking successfully - BookAstay',
          template: './invoice', 
          context: {
            email,
            bookingData,
            discount,
            note,
            paymentMethod
          },
        });
      } catch(error){
        console.error('Error while sending confirm booking email:', error);
      }
    }
}
