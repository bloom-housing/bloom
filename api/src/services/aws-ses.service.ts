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
  BulkEmailStatus,
} from '@aws-sdk/client-sesv2';

@Injectable()
export class AwsSesService extends EmailProvider {
  sesClient: SESv2Client;

  // SES bulk send limit per API call.
  static readonly MAX_EMAIL_TO_SEND_IN_BULK = 50;

  constructor(configService: ConfigService) {
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
      // SES inline templates (TemplateContent) do not support per-recipient variable
      // substitution via ReplacementTemplateData — that only works with stored named
      // templates. When perRecipientData is present, substitute __variable__ placeholders
      // manually per user and send in concurrent batches of MAX_EMAIL_TO_SEND_IN_BULK.
      if (input.perRecipientData?.length) {
        for (
          let i = 0;
          i < to.length;
          i += AwsSesService.MAX_EMAIL_TO_SEND_IN_BULK
        ) {
          const batch = to.slice(
            i,
            i + AwsSesService.MAX_EMAIL_TO_SEND_IN_BULK,
          );
          await Promise.all(
            batch.map((email, j) => {
              const data = input.perRecipientData[i + j];
              const resolvedBody = data
                ? Object.entries(data).reduce(
                    (html, [key, value]) => html.replaceAll(`-${key}-`, value),
                    body,
                  )
                : body;
              return this.send({
                ...input,
                to: email,
                body: resolvedBody,
                perRecipientData: undefined,
              });
            }),
          );
        }
        return;
      }

      const chunked: string[][] = [];
      for (
        let i = 0;
        i < to.length;
        i += AwsSesService.MAX_EMAIL_TO_SEND_IN_BULK
      ) {
        chunked.push(to.slice(i, i + AwsSesService.MAX_EMAIL_TO_SEND_IN_BULK));
      }

      for (const chunk of chunked) {
        try {
          const commandInput: SendBulkEmailRequest = {
            FromEmailAddress: from,
            BulkEmailEntries: chunk.map((email) => ({
              Destination: {
                ToAddresses: [email],
              },
            })),
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
          const response = await this.sesClient.send(command);

          const nonSuccessResults = response.BulkEmailEntryResults.filter(
            (result) => result.Status !== BulkEmailStatus.SUCCESS,
          );
          if (nonSuccessResults.length) {
            console.error(
              `Failed to send emails to ${nonSuccessResults.toString()}`,
            );
          }
        } catch (e) {
          console.log(e);
          console.error(`Failed to send emails to ${chunk.toString()}`);
        }
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
      return await this.sesClient
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
