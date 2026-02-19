export type EmailAttachmentData = {
  data: string;
  name: string;
  type: string;
};

export type SendEmailInput = {
  to: string | string[];
  from: string;
  subject: string;
  body: string;
  attachment?: EmailAttachmentData;
};

export abstract class EmailProvider {
  abstract send(SendEmailInput): Promise<unknown>;
}
