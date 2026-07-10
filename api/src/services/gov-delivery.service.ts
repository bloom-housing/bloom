import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import juice from 'juice';
import { firstValueFrom } from 'rxjs';
import { EmailProvider, SendEmailInput } from './email-provider.service';

export class GovDeliveryService extends EmailProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  async send(input: SendEmailInput): Promise<unknown> {
    const {
      GOVDELIVERY_API_URL,
      GOVDELIVERY_USERNAME,
      GOVDELIVERY_PASSWORD,
      GOVDELIVERY_TOPIC,
    } = process.env;
    const isGovConfigured =
      !!GOVDELIVERY_API_URL &&
      !!GOVDELIVERY_USERNAME &&
      !!GOVDELIVERY_PASSWORD &&
      !!GOVDELIVERY_TOPIC;
    if (!isGovConfigured) {
      console.warn(
        'failed to configure Govdelivery, ensure that all env variables are provided',
      );
      return;
    }

    // If there is no from email address configured, govDelivery will use the default email address associated with the account
    const fromEmailAddress =
      this.configService.get<string>('GOVDELIVERY_FROM_EMAIL_ID') || '';

    // juice inlines css to allow for email styling
    const inlineHtml = juice(input.body);
    const govEmailXml = `<bulletin>\n <subject>${input.subject}</subject>\n  <body><![CDATA[\n     
      ${inlineHtml}\n   ]]></body>\n   <sms_body nil='true'></sms_body>\n   <from_address_id>${fromEmailAddress}</from_address_id>\n   <publish_rss type='boolean'>false</publish_rss>\n   <open_tracking type='boolean'>true</open_tracking>\n   <click_tracking type='boolean'>true</click_tracking>\n   <share_content_enabled type='boolean'>true</share_content_enabled>\n   <topics type='array'>\n     <topic>\n       <code>${GOVDELIVERY_TOPIC}</code>\n     </topic>\n   </topics>\n   <categories type='array' />\n </bulletin>`;

    await firstValueFrom(
      this.httpService.post(GOVDELIVERY_API_URL, govEmailXml, {
        headers: {
          'Content-Type': 'application/xml',
          Authorization: `Basic ${Buffer.from(
            `${GOVDELIVERY_USERNAME}:${GOVDELIVERY_PASSWORD}`,
          ).toString('base64')}`,
        },
      }),
    );
  }
}
