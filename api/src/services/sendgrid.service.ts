import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientResponse,
  MailDataRequired,
  MailService,
  ResponseError,
} from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    this.mailService.setApiKey(configService.get<string>('EMAIL_API_KEY'));
  }

  public async send(
    data: MailDataRequired,
    isMultiple?: boolean,
    cb?: (
      err: Error | ResponseError,
      result: [ClientResponse, unknown],
    ) => void,
  ): Promise<[ClientResponse, unknown]> {
    return this.mailService.send(data, isMultiple, cb);
  }
}
