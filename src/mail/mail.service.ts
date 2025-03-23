import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(
    user: any,
    codeId: string,
    title: string = 'Confirm your Email ✔',
  ) {
    const currentYear = new Date().getFullYear();

    await this.mailerService.sendMail({
      to: user.email, // list of receivers
      // from: 'noreply@nestjs.com', // sender address
      subject: title, // Subject line
      template: 'confirmation',
      context: {
        name: user.display_name ?? user.email,
        activationCode: codeId,
        year: currentYear,
      },
    });
  }
}
