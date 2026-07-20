import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import juice from 'juice';
import { firstValueFrom } from 'rxjs';
import { SendEmailInput } from './email-provider.service';

@Injectable()
export class GovDeliveryService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(Logger)
    private logger = new Logger(GovDeliveryService.name),
  ) {}

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
      this.logger.warn(
        'failed to configure Govdelivery, ensure that all env variables are provided',
      );
      return;
    }

    // in govDelivery you can override the from email address for any send and if no id is passed in the default will be used.
    // This ID should match the override email address ID in the GovDelivery system. If there is a mismatch the email send will fail.
    const fromEmailAddress = process.env.GOVDELIVERY_FROM_EMAIL_ID || '';

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
