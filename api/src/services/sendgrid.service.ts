import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailProvider, SendEmailInput } from './email-provider.service';
import { MailService } from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';

@Injectable()
export class SendGridService extends EmailProvider {
  maxRetries: number;
  mailService: MailService;

  // SendGrid allows up to 1000 personalizations per API call (platform limit).
  static readonly MAX_PERSONALIZATIONS = 1000;

  constructor(private readonly configService: ConfigService) {
    super();
    this.mailService = new MailService();
    this.mailService.setApiKey(configService.get<string>('EMAIL_API_KEY'));
    this.maxRetries = configService.get<number>('EMAIL_MAX_RETRIES', 3);
  }

  public async send(input: SendEmailInput): Promise<unknown> {
    // When per-recipient data is present, use SendGrid personalizations so all
    // recipients are handled in one API call per 1000 (rather than one call each) which is SendGrid's personalization limit.
    // Substitution keys are passed bare (e.g. 'unsubscribeUrl') — the @sendgrid/mail SDK wraps
    // them in {{}} automatically via wrapSubstitutions, so they match \{{key}} placeholders in the body.
    if (Array.isArray(input.to) && input.perRecipientData?.length) {
      const chunks: string[][] = [];
      for (
        let i = 0;
        i < input.to.length;
        i += SendGridService.MAX_PERSONALIZATIONS
      ) {
        chunks.push(
          input.to.slice(i, i + SendGridService.MAX_PERSONALIZATIONS),
        );
      }

      return Promise.all(
        chunks.map((chunk, chunkIndex) => {
          const offset = chunkIndex * SendGridService.MAX_PERSONALIZATIONS;
          const emailParams: MailDataRequired = {
            from: input.from,
            subject: input.subject,
            html: input.body,
            // Wrappers tell the SDK to emit '-key-' substitution tags rather than the
            // default '{{key}}', which SendGrid would interpret as a dynamic template
            // expression and silently replace with empty string.
            substitutionWrappers: ['-', '-'],
            personalizations: chunk.map((email, i) => ({
              to: [{ email }],
              substitutions: input.perRecipientData[offset + i] || {},
            })),
          };
          return this.send_inner_params(emailParams, this.maxRetries);
        }),
      );
    }

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

    return this.send_inner_params(emailParams, retries, isMultipleRecipients);
  }

  private async send_inner_params(
    emailParams: MailDataRequired,
    retries: number,
    isMultipleRecipients = false,
  ): Promise<unknown> {
    const callBack = (error) => {
      if (error) {
        console.error(
          `Error sending email to: ${JSON.stringify(
            emailParams.to,
          )}! Error body:`,
          error?.response?.body || error,
        );
        if (retries > 0) {
          void this.send_inner_params(
            emailParams,
            retries - 1,
            isMultipleRecipients,
          );
        }
      }
    };

    return this.mailService.send(emailParams, isMultipleRecipients, callBack);
  }
}
