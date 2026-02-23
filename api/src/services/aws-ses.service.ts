import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailProvider, SendEmailInput } from './email-provider.service';
import {
  SESv2Client,
  SESv2ClientConfig,
  SendEmailCommand,
  SendEmailRequest,
  SESv2ServiceException,
  SendBulkEmailRequest,
  SendBulkEmailCommand,
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

    if (isMultipleRecipients) {
      const MAX_EMAIL_TO_SEND_IN_BULK = 50;

      const emailsChunked = to.reduce((accum, curr, i) => {
        const chunk = Math.floor(i / MAX_EMAIL_TO_SEND_IN_BULK);
        accum[chunk] = [].concat(accum[chunk] || [], curr);
        return accum;
      }, []);
      for (const emailList of emailsChunked) {
        const commandInput: SendBulkEmailRequest = {
          FromEmailAddress: from,
          BulkEmailEntries: emailList.map((email) => {
            return {
              Destination: {
                ToAddresses: [email],
              },
            };
          }),
          DefaultContent: {
            Template: {
              TemplateContent: {
                Subject: subject,
                Html: body,
              },
              TemplateData: '{}', // We need to send template data even if there are no variables,
              Attachments: attachments,
            },
          },
        };
        const command = new SendBulkEmailCommand(commandInput);
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
    } else {
      const commandInput: SendEmailRequest = {
        FromEmailAddress: from,
        Destination: {
          ToAddresses: [to],
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
}
