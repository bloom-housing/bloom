import { Injectable } from '@nestjs/common';
import { AwsCredentialIdentity } from '@aws-sdk/types';
import {
  PinpointSMSVoiceV2Client,
  SendTextMessageCommand,
} from '@aws-sdk/client-pinpoint-sms-voice-v2';
import twilio from 'twilio';
import TwilioClient from 'twilio/lib/rest/Twilio';

@Injectable()
export class SmsService {
  client: TwilioClient;
  awsClient: PinpointSMSVoiceV2Client;
  public constructor() {
    if (process.env.SMS_PROVIDER === 'aws') {
      if (process.env.AWS_SMS_REGION) {
        let credentials: undefined | AwsCredentialIdentity;
        const keyId = process.env.AWS_SMS_ACCESS_KEY_ID;
        const secret = process.env.AWS_SMS_SECRET_ACCESS_KEY;
        if (keyId && secret) {
          credentials = {
            accessKeyId: keyId,
            secretAccessKey: secret,
          };
        }
        this.awsClient = new PinpointSMSVoiceV2Client({
          region: process.env.AWS_SMS_REGION,
          credentials,
        });
      }
    } else if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN
    ) {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
    }
  }
  public async sendMfaCode(
    phoneNumber: string,
    singleUseCode: string,
  ): Promise<void> {
    if (process.env.SMS_PROVIDER === 'aws') {
      if (!this.awsClient) {
        return;
      }
      await this.awsClient.send(
        new SendTextMessageCommand({
          DestinationPhoneNumber: phoneNumber,
          OriginationIdentity: process.env.AWS_SMS_ORIGINATION_NUMBER,
          MessageBody: `Your Partners Portal account access token: ${singleUseCode}`,
          MessageType: 'TRANSACTIONAL',
        }),
      );
    } else {
      if (!this.client) {
        return;
      }
      await this.client.messages.create({
        body: `Your Partners Portal account access token: ${singleUseCode}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
    }
  }
}
