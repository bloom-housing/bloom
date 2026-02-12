import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailProvider, SendEmailInput } from './email-provider.service';
import {
  SESv2Client,
  SESv2ClientConfig,
  SendEmailCommand,
  SendEmailRequest,
  SESv2ServiceException,
} from '@aws-sdk/client-sesv2';

@Injectable()
export class AwsSesService extends EmailProvider {
  sesClient: SESv2Client;

  constructor(private readonly configService: ConfigService) {
    super();
    const config: SESv2ClientConfig = {
      maxAttempts: configService.get<number>('EMAIL_MAX_RETRIES', 3),
    };
    this.sesClient = new SESv2Client(config);
  }

  public async send(input: SendEmailInput): Promise<unknown> {
    const { to, from, subject, body, attachment } = input;
    const isMultipleRecipients = Array.isArray(to);

    let attachments = undefined;
    if (attachment) {
      attachments = [
        {
          FileName: attachment.name,
          RawContent: Buffer.from(attachment.data).toString('base64'),
          ContentType: attachment.type,
          ContentDisposition: 'ATTACHMENT',
        },
      ];
    }

    const commandInput: SendEmailRequest = {
      FromEmailAddress: from,
      Destination: {
        ToAddresses: isMultipleRecipients ? to : [to],
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: body,
              Charset: 'UTF-8',
            },
          },
          Attachments: attachments,
        },
      },
    };
    const command = new SendEmailCommand(commandInput);
    return this.sesClient
      .send(command)
      .catch(function (err: SESv2ServiceException) {
        console.error(
          `Error sending email to: ${
            isMultipleRecipients ? to.toString() : to
          }! Error body:`,
          err.toString(),
        );
      });
  }
}
