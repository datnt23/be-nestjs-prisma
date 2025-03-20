import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmationEmail(user: any, codeId: string) {
    const currentYear = new Date().getFullYear();

    await this.mailerService.sendMail({
      to: user.email, // list of receivers
      // from: 'noreply@nestjs.com', // sender address
      subject: 'Confirm your Email ✔', // Subject line
      text: 'welcome', // plaintext body
      // html: '<b>Hello word with datnt</b>', // HTML body content
      template: 'confirmation',
      context: {
        name: user.display_name ?? user.email,
        activationCode: codeId,
        year: currentYear,
      },
    });
  }
}
