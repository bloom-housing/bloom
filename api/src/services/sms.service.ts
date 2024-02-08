import { Injectable } from '@nestjs/common';
import twilio from 'twilio';
import TwilioClient from 'twilio/lib/rest/Twilio';

@Injectable()
export class SmsService {
  client: TwilioClient;
  public constructor() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
    }
  }
  public async sendMfaCode(
    phoneNumber: string,
    mfaCode: string,
  ): Promise<void> {
    if (!this.client) {
      return;
    }
    await this.client.messages.create({
      body: `Your Partners Portal account access token: ${mfaCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
  }
}
