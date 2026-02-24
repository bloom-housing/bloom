import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailProvider, SendEmailInput } from './email-provider.service';
import { MailService } from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';

@Injectable()
export class SendGridService extends EmailProvider {
  maxRetries: number;
  mailService: MailService;

  constructor(private readonly configService: ConfigService) {
    super();
    this.mailService = new MailService();
    this.mailService.setApiKey(configService.get<string>('EMAIL_API_KEY'));
    this.maxRetries = configService.get<number>('EMAIL_MAX_RETRIES', 3);
  }

  public async send(input: SendEmailInput): Promise<unknown> {
    return this.send_inner(input, this.maxRetries);
  }

  private async send_inner(
    input: SendEmailInput,
    retries: number,
  ): Promise<unknown> {
    const { to, from, subject, body, attachment } = input;
    const isMultipleRecipients = Array.isArray(to);

    const emailParams: MailDataRequired = {
      to,
      from,
      subject,
      html: body,
    };
    if (attachment) {
      emailParams.attachments = [
        {
          content: Buffer.from(attachment.data).toString('base64'),
          filename: attachment.name,
          type: attachment.type,
          disposition: 'attachment',
        },
      ];
    }

    const callBack = (error) => {
      if (error) {
        console.error(
          `Error sending email to: ${
            isMultipleRecipients ? to.toString() : to
          }! Error body:`,
          error?.response?.body || error,
        );
        if (retries > 0) {
          void this.send_inner(input, retries - 1);
        }
      }
    };

    return this.mailService.send(emailParams, isMultipleRecipients, callBack);
  }
}
