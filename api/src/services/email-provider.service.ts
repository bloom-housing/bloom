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
  // Per-recipient template substitution data, parallel to `to[]` when sending to multiple recipients.
  // Allows a bulk send to carry per-user values (e.g. a signed unsubscribe URL) without one API
  // call per recipient. Each key maps to a \{{key}} escape in the Handlebars template, which outputs
  // the literal {{key}} placeholder into the rendered HTML for providers to substitute at send time.
  // SES: string-replaces {{key}} placeholders per user, sends 50 concurrent individual calls
  //   (inline TemplateContent doesn't support ReplacementTemplateData bulk substitution).
  // SendGrid: uses personalizations with bare key substitutions — the SDK wraps keys in {{}} via
  //   wrapSubstitutions — up to 1000 recipients per API call.
  perRecipientData?: Record<string, string>[];
};

export abstract class EmailProvider {
  abstract send(SendEmailInput): Promise<unknown>;
}
