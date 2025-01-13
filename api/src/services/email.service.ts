import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import fs from 'fs';
import Handlebars from 'handlebars';
import juice from 'juice';
import Polyglot from 'node-polyglot';
import { firstValueFrom } from 'rxjs';
import path from 'path';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import * as aws from '@aws-sdk/client-sesv2';
import { TranslationService } from './translation.service';
import { JurisdictionService } from './jurisdiction.service';
import { Jurisdiction } from '../dtos/jurisdictions/jurisdiction.dto';
import {
  LanguagesEnum,
  ListingEventsTypeEnum,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import { IdDTO } from '../dtos/shared/id.dto';
import { Listing } from '../dtos/listings/listing.dto';
import { ApplicationCreate } from '../dtos/applications/application-create.dto';
import { User } from '../dtos/users/user.dto';
import Unit from '../dtos/units/unit.dto';
import { getPublicEmailURL } from '../utilities/get-public-email-url';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(advanced);

type listingInfo = {
  id: string;
  name: string;
  juris: string;
};

const SEND_FROM_EMAIL = 'Doorway <no-reply@housingbayarea.org>';

@Injectable()
export class EmailService {
  polyglot: Polyglot;
  client: aws.SESv2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly translationService: TranslationService,
    private readonly jurisdictionService: JurisdictionService,
    private readonly httpService: HttpService,
    @Inject(Logger)
    private logger = new Logger(EmailService.name),
  ) {
    const sesClient = new aws.SESv2Client({
      region: process.env.AWS_REGION,
    });

    this.client = sesClient;

    this.polyglot = new Polyglot({
      phrases: {},
    });
    const polyglot = this.polyglot;
    Handlebars.registerHelper(
      't',
      function (
        phrase: string,
        options?: number | Polyglot.InterpolationOptions,
      ) {
        return polyglot.t(phrase, options);
      },
    );
    const parts = this.partials();
    Handlebars.registerPartial(parts);
  }

  private template(view: string) {
    return Handlebars.compile(
      fs.readFileSync(
        path.join(path.resolve(__dirname, '..', 'views'), `/${view}.hbs`),
        'utf8',
      ),
    );
  }

  private partial(view: string) {
    return fs.readFileSync(
      path.join(path.resolve(__dirname, '..', 'views'), `/${view}`),
      'utf8',
    );
  }

  private partials() {
    const partials = {};
    const dirName = path.resolve(__dirname, '..', 'views/partials');

    fs.readdirSync(dirName).forEach((filename) => {
      partials[filename.slice(0, -4)] = this.partial('partials/' + filename);
    });

    const layoutsDirName = path.resolve(__dirname, '..', 'views/layouts');

    fs.readdirSync(layoutsDirName).forEach((filename) => {
      partials[`layout_${filename.slice(0, -4)}`] = this.partial(
        'layouts/' + filename,
      );
    });

    return partials;
  }

  async govSend(rawHtml: string, subject: string) {
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

    // juice inlines css to allow for email styling
    const inlineHtml = juice(rawHtml);
    const govEmailXml = `<bulletin>\n <subject>${subject}</subject>\n  <body><![CDATA[\n     
      ${inlineHtml}\n   ]]></body>\n   <sms_body nil='true'></sms_body>\n   <publish_rss type='boolean'>false</publish_rss>\n   <open_tracking type='boolean'>true</open_tracking>\n   <click_tracking type='boolean'>true</click_tracking>\n   <share_content_enabled type='boolean'>true</share_content_enabled>\n   <topics type='array'>\n     <topic>\n       <code>${GOVDELIVERY_TOPIC}</code>\n     </topic>\n   </topics>\n   <categories type='array' />\n </bulletin>`;

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

  public async sendSingleSES(
    mailOptions: {
      to: string;
      subject: string;
      html: string;
      text?: string;
    },
    useCase: string,
  ) {
    try {
      const command = new aws.SendEmailCommand({
        FromEmailAddress: SEND_FROM_EMAIL,
        Destination: { ToAddresses: [mailOptions.to] },
        Content: {
          Simple: {
            Subject: {
              Data: mailOptions.subject,
            },
            Body: {
              Html: {
                Data: mailOptions.html,
              },
              Text: mailOptions.text
                ? {
                    Data: mailOptions.text,
                  }
                : undefined,
            },
          },
        },
      });
      const response = await this.client.send(command);
      if (response.$metadata?.httpStatusCode !== 200) {
        this.logger.error(
          `Email send for ${useCase} email to ${mailOptions.to} did not return 200`,
        );
      }
    } catch (e) {
      this.logger.log(e);
      this.logger.error(`Failed to send ${useCase} email to ${mailOptions.to}`);
      return e;
    }
  }

  public async sendBulkSES(
    mailOptions: {
      emails: string[];
      subject: string;
      html: string;
      text?: string;
    },
    useCase: string,
    includeJurisdictionEmail = false,
  ) {
    const siteEmail = this.configService.get('SITE_EMAIL');
    const emailsToSendTo =
      includeJurisdictionEmail && siteEmail
        ? [siteEmail, ...mailOptions.emails]
        : mailOptions.emails;
    const MAX_EMAIL_TO_SEND_IN_BULK = 50;
    const emailsChunked = emailsToSendTo.reduce((all, one, i) => {
      const chunk = Math.floor(i / MAX_EMAIL_TO_SEND_IN_BULK);
      all[chunk] = [].concat(all[chunk] || [], one);
      return all;
    }, []);
    for (const emailList of emailsChunked) {
      try {
        const command = new aws.SendBulkEmailCommand({
          FromEmailAddress: SEND_FROM_EMAIL,
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
                Subject: mailOptions.subject,
                Html: mailOptions.html,
              },
              TemplateData: '{}', // We need to send template data even if there are no variables
            },
          },
        });
        const response = await this.client.send(command);
        const nonSuccessResults = response.BulkEmailEntryResults.filter(
          (result) => result.Status !== aws.BulkEmailStatus.SUCCESS,
        );
        if (nonSuccessResults.length) {
          this.logger.error(
            `Failed to send ${useCase} email to ${nonSuccessResults.toString()}`,
          );
        }
      } catch (e) {
        this.logger.log(e);
        this.logger.error(
          `Failed to send ${useCase} email to ${emailList.toString()}`,
        );
        return e;
      }
    }
  }

  // TODO: update this to be memoized based on jurisdiction and language
  // https://github.com/bloom-housing/bloom/issues/3648
  private async loadTranslations(
    jurisdiction: Jurisdiction | null,
    language?: LanguagesEnum,
  ) {
    const translations = await this.translationService.getMergedTranslations(
      jurisdiction?.id,
      language,
    );
    this.polyglot.replace(translations);
  }

  private async getJurisdiction(
    jurisdictionIds: IdDTO[] | null,
    jurisdictionName?: string,
  ): Promise<Jurisdiction | null> {
    // Only return the jurisdiction if there is one jurisdiction passed in.
    // For example if the user is tied to more than one jurisdiction the user should received the generic translations
    if (jurisdictionIds?.length === 1) {
      return await this.jurisdictionService.findOne({
        jurisdictionId: jurisdictionIds[0]?.id,
      });
    } else if (jurisdictionName) {
      return await this.jurisdictionService.findOne({
        jurisdictionName: jurisdictionName,
      });
    }
    return null;
  }

  /* Send welcome email to new public users */
  public async welcome(
    jurisdictionName: string,
    user: User,
    appUrl: string,
    confirmationUrl: string,
  ) {
    const jurisdiction = await this.getJurisdiction(null, jurisdictionName);
    const baseUrl = appUrl ? new URL(appUrl).origin : undefined;
    await this.loadTranslations(jurisdiction, user.language);

    await this.sendSingleSES(
      {
        to: user.email,
        subject: this.polyglot.t('register.welcome'),
        html: this.template('register-email')({
          user: user,
          confirmationUrl: confirmationUrl,
          appOptions: { appUrl: baseUrl },
        }),
      },
      'welcome',
    );
  }

  /* Send invite email to partner users */
  async invitePartnerUser(
    jurisdictionIds: IdDTO[],
    user: User,
    appUrl: string,
    confirmationUrl: string,
  ) {
    const jurisdiction = await this.getJurisdiction(jurisdictionIds);
    void (await this.loadTranslations(jurisdiction, user.language));

    await this.sendSingleSES(
      {
        to: user.email,
        subject: this.polyglot.t('invite.hello'),
        html: this.template('invite')({
          user: user,
          confirmationUrl: confirmationUrl,
          appOptions: { appUrl },
        }),
      },
      'invitePartnerUser',
    );
  }

  /* send change of email email */
  public async changeEmail(
    jurisdictionName: string,
    user: User,
    appUrl: string,
    confirmationUrl: string,
    newEmail: string,
  ) {
    const jurisdiction = await this.getJurisdiction(null, jurisdictionName);
    await this.loadTranslations(jurisdiction, user.language);

    await this.sendSingleSES(
      {
        to: newEmail,
        subject: 'Doorway email change request',
        html: this.template('change-email')({
          user: user,
          confirmationUrl: confirmationUrl,
          appOptions: { appUrl: appUrl },
        }),
      },
      'changeEmail',
    );
  }

  /* Send forgot password email */
  public async forgotPassword(
    jurisdictionIds: IdDTO[],
    user: User,
    appUrl: string,
    resetToken: string,
  ) {
    const jurisdiction = await this.getJurisdiction(jurisdictionIds);
    void (await this.loadTranslations(jurisdiction, user.language));
    const compiledTemplate = this.template('forgot-password');
    const resetUrl = getPublicEmailURL(appUrl, resetToken, '/reset-password');
    const baseUrl = appUrl ? new URL(appUrl).origin : undefined;

    await this.sendSingleSES(
      {
        to: user.email,
        subject: this.polyglot.t('forgotPassword.subject'),
        html: compiledTemplate({
          resetUrl: resetUrl,
          resetOptions: { appUrl: baseUrl },
          user: user,
        }),
      },
      'forgotPassword',
    );
  }

  public async sendMfaCode(user: User, singleUseCode: string) {
    const jurisdiction = await this.getJurisdiction(user.jurisdictions);
    void (await this.loadTranslations(jurisdiction, user.language));

    await this.sendSingleSES(
      {
        to: user.email,
        subject: `${singleUseCode} is your secure Partners Portal account access token`,
        text: `${singleUseCode} is your secure Partners Portal account access token`,
        html: this.template('mfa-code')({
          user: user,
          mfaCodeOptions: { singleUseCode },
        }),
      },
      'sendMfaCode',
    );
  }

  public async sendSingleUseCode(
    user: User,
    singleUseCode: string,
    jurisdictionName: string,
  ) {
    const jurisdiction = await this.getJurisdiction(
      user.jurisdictions,
      jurisdictionName,
    );
    void (await this.loadTranslations(jurisdiction, user.language));

    await this.sendSingleSES(
      {
        to: user.email,
        subject: user.confirmedAt
          ? `${singleUseCode} is your secure Doorway sign-in code`
          : `${singleUseCode} is your secure Doorway verification code`,
        html: this.template('single-use-code')({
          user: user,
          singleUseCodeOptions: {
            singleUseCode,
          },
        }),
      },
      'sendSingleUseCode',
    );
  }

  public async applicationConfirmation(
    listing: Listing,
    application: ApplicationCreate,
    appUrl: string,
  ) {
    const jurisdiction = await this.getJurisdiction([listing.jurisdictions]);
    void (await this.loadTranslations(jurisdiction, application.language));
    const listingUrl = `${appUrl}/listing/${listing.id}`;
    const compiledTemplate = this.template('confirmation');

    let eligibleText: string;
    let preferenceText: string;
    let contactText = null;
    let duplicateText = null;
    if (listing.reviewOrderType === ReviewOrderTypeEnum.firstComeFirstServe) {
      eligibleText = this.polyglot.t('confirmation.eligible.fcfs');
      preferenceText = this.polyglot.t('confirmation.eligible.fcfsPreference');
    }
    if (listing.reviewOrderType === ReviewOrderTypeEnum.lottery) {
      eligibleText = this.polyglot.t('confirmation.eligible.lottery');
      preferenceText = this.polyglot.t(
        'confirmation.eligible.lotteryPreference',
      );
      duplicateText = this.polyglot.t('lotteryAvailable.duplicatesDetails');
    }
    if (listing.reviewOrderType === ReviewOrderTypeEnum.waitlist) {
      eligibleText = this.polyglot.t('confirmation.eligible.waitlist');
      contactText = this.polyglot.t('confirmation.eligible.waitlistContact');
      preferenceText = this.polyglot.t(
        'confirmation.eligible.waitlistPreference',
      );
    }

    const user = {
      firstName: application.applicant.firstName,
      middleName: application.applicant.middleName,
      lastName: application.applicant.lastName,
    };

    const nextStepsUrl = this.polyglot.t('confirmation.nextStepsUrl');

    await this.sendSingleSES(
      {
        to: application.applicant.emailAddress,
        subject: this.polyglot.t('confirmation.subject'),
        html: compiledTemplate({
          subject: this.polyglot.t('confirmation.subject'),
          header: {
            logoTitle: this.polyglot.t('header.logoTitle'),
            logoUrl: this.polyglot.t('header.logoUrl'),
          },
          listing,
          listingUrl,
          application,
          preferenceText,
          interviewText: this.polyglot.t('confirmation.interview'),
          eligibleText,
          duplicateText,
          termsUrl: 'https://mtc.ca.gov/doorway-housing-portal-terms-use',
          contactText,
          nextStepsUrl:
            nextStepsUrl != 'confirmation.nextStepsUrl' ? nextStepsUrl : null,
          user,
        }),
      },
      'applicationConfirmation',
    );
  }

  public async requestApproval(
    jurisdictionId: IdDTO,
    listingInfo: IdDTO,
    emails: string[],
    appUrl: string,
  ) {
    const jurisdiction = await this.getJurisdiction([jurisdictionId]);
    void (await this.loadTranslations(jurisdiction));

    this.logger.log(
      `Sending request approval email for listing ${listingInfo.name} to ${emails.length} emails`,
    );

    await this.sendBulkSES(
      {
        emails: emails,
        subject: this.polyglot.t('requestApproval.header'),
        html: this.template('request-approval')({
          appOptions: { listingName: listingInfo.name },
          appUrl: appUrl,
          listingUrl: `${appUrl}/listings/${listingInfo.id}`,
        }),
      },
      'requestApproval',
    );
  }

  public async changesRequested(
    user: User,
    listingInfo: listingInfo,
    emails: string[],
    appUrl: string,
  ) {
    const jurisdiction = listingInfo.juris
      ? await this.getJurisdiction([{ id: listingInfo.juris }])
      : user.jurisdictions[0];
    void (await this.loadTranslations(jurisdiction));

    this.logger.log(
      `Sending changes requested email for listing ${listingInfo.name} to ${emails.length} emails`,
    );

    await this.sendBulkSES(
      {
        emails: emails,
        subject: this.polyglot.t('changesRequested.header'),
        html: this.template('changes-requested')({
          appOptions: { listingName: listingInfo.name },
          appUrl: appUrl,
          listingUrl: `${appUrl}/listings/${listingInfo.id}`,
        }),
      },
      'changesRequested',
    );
  }

  public async listingApproved(
    jurisdictionId: IdDTO,
    listingInfo: IdDTO,
    emails: string[],
    publicUrl: string,
  ) {
    const jurisdiction = await this.getJurisdiction([jurisdictionId]);
    void (await this.loadTranslations(jurisdiction));

    this.logger.log(
      `Sending listing approved email for listing ${listingInfo.name} to ${emails.length} emails`,
    );

    await this.sendBulkSES(
      {
        emails: emails,
        subject: this.polyglot.t('listingApproved.header'),
        html: this.template('listing-approved')({
          appOptions: { listingName: listingInfo.name },
          listingUrl: `${publicUrl}/listing/${listingInfo.id}`,
        }),
      },
      'listingApproved',
    );
  }

  public async listingOpportunity(listing: Listing) {
    const jurisdiction = await this.getJurisdiction([listing.jurisdictions]);
    void (await this.loadTranslations(jurisdiction, LanguagesEnum.en));
    const compiledTemplate = this.template('listing-opportunity');

    if (this.configService.get<string>('NODE_ENV') == 'production') {
      this.logger.log(
        `Preparing to send a listing opportunity email for ${listing.name} from ${jurisdiction.emailFromAddress}...`,
      );
    }

    // Gather all variables from each unit into one place
    const units: {
      bedrooms: { [key: number]: Unit[] };
      rent: number[];
      minIncome: number[];
      maxIncome: number[];
    } = listing.units?.reduce(
      (summaries, unit) => {
        if (unit.monthlyIncomeMin) {
          summaries.minIncome.push(Number.parseFloat(unit.monthlyIncomeMin));
        }
        if (unit.annualIncomeMax) {
          summaries.maxIncome.push(
            Number.parseFloat(unit.annualIncomeMax) / 12.0,
          );
        }
        if (unit.monthlyRent) {
          summaries.rent.push(Number.parseFloat(unit.monthlyRent));
        }
        const thisBedroomInfo = summaries.bedrooms[unit.unitTypes?.name];
        summaries.bedrooms[unit.unitTypes?.name] = thisBedroomInfo
          ? [...thisBedroomInfo, unit]
          : [unit];
        return summaries;
      },
      {
        bedrooms: {},
        rent: [],
        minIncome: [],
        maxIncome: [],
      },
    );
    const tableRows = [];
    if (listing.reservedCommunityTypes?.name) {
      tableRows.push({
        label: this.polyglot.t('rentalOpportunity.community'),
        value: this.formatCommunityType[listing.reservedCommunityTypes.name],
      });
    }
    if (listing.applicationDueDate) {
      tableRows.push({
        label: this.polyglot.t('rentalOpportunity.applicationsDue'),
        value: dayjs(listing.applicationDueDate)
          .tz(process.env.TIME_ZONE)
          .format('MMMM D, YYYY [at] h:mma z'),
        bolded: true,
      });
    }
    tableRows.push({
      label: this.polyglot.t('rentalOpportunity.address'),
      value: `${listing.listingsBuildingAddress?.street}, ${listing.listingsBuildingAddress?.city} ${listing.listingsBuildingAddress?.state} ${listing.listingsBuildingAddress?.zipCode}`,
    });
    Object.entries(units?.bedrooms || {})?.forEach(([key, bedroom]) => {
      const sqFtString = this.formatUnitDetails(bedroom, 'sqFeet', 'sqft');
      const bathroomstring = this.formatUnitDetails(
        bedroom,
        'numBathrooms',
        'bath',
        'baths',
      );
      tableRows.push({
        label: this.polyglot.t(`rentalOpportunity.${key}`),
        value: `${bedroom?.length} unit${
          bedroom.length > 1 ? 's' : ''
        }${bathroomstring}${sqFtString}`,
      });
    });
    if (units?.rent?.length) {
      tableRows.push({
        label: this.polyglot.t('rentalOpportunity.rent'),
        value: this.formatPricing(units.rent),
      });
    }
    if (units?.minIncome?.length) {
      tableRows.push({
        label: this.polyglot.t('rentalOpportunity.minIncome'),
        value: this.formatPricing(units.minIncome),
      });
    }
    if (units?.maxIncome?.length) {
      tableRows.push({
        label: this.polyglot.t('rentalOpportunity.maxIncome'),
        value: this.formatPricing(units.maxIncome),
      });
    }
    if (listing.listingEvents && listing.listingEvents.length > 0) {
      const lotteryEvent = listing.listingEvents.find(
        (event) => event.type === ListingEventsTypeEnum.publicLottery,
      );
      if (lotteryEvent && lotteryEvent.startDate) {
        let lotteryDateTime = dayjs(lotteryEvent.startDate)
          .tz(process.env.TIME_ZONE)
          .format('MMMM D, YYYY');
        if (lotteryEvent.startTime) {
          lotteryDateTime =
            lotteryDateTime +
            ` at ${dayjs(lotteryEvent.startTime)
              .tz(process.env.TIME_ZONE)
              .format('h:mma z')}`;
        }
        tableRows.push({
          label: this.polyglot.t('rentalOpportunity.lottery'),
          value: lotteryDateTime,
        });
      }
    }

    const languages = [
      {
        name: this.polyglot.t('rentalOpportunity.viewButton.en'),
        code: LanguagesEnum.en,
      },
      {
        name: this.polyglot.t('rentalOpportunity.viewButton.es'),
        code: LanguagesEnum.es,
      },
      {
        name: this.polyglot.t('rentalOpportunity.viewButton.zh'),
        code: LanguagesEnum.zh,
      },
      {
        name: this.polyglot.t('rentalOpportunity.viewButton.vi'),
        code: LanguagesEnum.vi,
      },
      {
        name: this.polyglot.t('rentalOpportunity.viewButton.tl'),
        code: LanguagesEnum.tl,
      },
    ];

    const languageUrls = languages.map((language) => {
      return {
        name: language.name,
        url: `${jurisdiction.publicUrl}/${language.code}/listing/${listing.id}`,
      };
    });

    const compiled = compiledTemplate({
      listingName: this.stripAngleBrackets(listing.name),
      tableRows,
      languageUrls,
    });

    await this.govSend(compiled, 'New rental opportunity');
  }

  public async lotteryReleased(
    listingInfo: listingInfo,
    emails: string[],
    appUrl: string,
  ) {
    const jurisdiction = await this.getJurisdiction([
      { id: listingInfo.juris },
    ]);
    void (await this.loadTranslations(jurisdiction));
    this.logger.log(
      `Sending lottery released email for listing ${listingInfo.name} to ${emails.length} emails`,
    );
    await this.sendBulkSES(
      {
        emails: emails,
        subject: this.polyglot.t('lotteryReleased.header', {
          listingName: listingInfo.name,
        }),
        html: this.template('lottery-released')({
          appOptions: { listingName: listingInfo.name },
          appUrl: appUrl,
          listingUrl: `${appUrl}/listings/${listingInfo.id}`,
        }),
      },
      'lotteryReleased',
      true,
    );
  }

  public async lotteryPublishedAdmin(
    listingInfo: listingInfo,
    emails: string[],
    appUrl: string,
  ) {
    const jurisdiction = await this.getJurisdiction([
      { id: listingInfo.juris },
    ]);
    void (await this.loadTranslations(jurisdiction));
    this.logger.log(
      `Sending lottery published admin email for listing ${listingInfo.name} to ${emails.length} emails`,
    );
    await this.sendBulkSES(
      {
        emails: emails,
        subject: this.polyglot.t('lotteryPublished.header', {
          listingName: listingInfo.name,
        }),
        html: this.template('lottery-published-admin')({
          appOptions: { listingName: listingInfo.name, appUrl: appUrl },
        }),
      },
      'lotteryPublishedAdmin',
      true,
    );
  }

  /**
   *
   * @param emails a key in LanguagesEnum to a list of emails of applicants who submitted in that language
   */
  public async lotteryPublishedApplicant(
    listingInfo: listingInfo,
    emails: { [key: string]: string[] },
  ) {
    const jurisdiction = await this.getJurisdiction([
      { id: listingInfo.juris },
    ]);

    for (const language in emails) {
      void (await this.loadTranslations(null, language as LanguagesEnum));
      this.logger.log(
        `Sending lottery published ${language} email for listing ${listingInfo.name} to ${emails[language]?.length} emails`,
      );
      await this.sendBulkSES(
        {
          emails: emails[language],
          subject: this.polyglot.t('lotteryAvailable.header', {
            listingName: listingInfo.name,
          }),
          html: this.template('lottery-published-applicant')({
            appOptions: {
              listingName: listingInfo.name,
              appUrl: jurisdiction.publicUrl,
            },
            appUrl: jurisdiction.publicUrl,
            termsUrl: 'https://mtc.ca.gov/doorway-housing-portal-terms-use',
            notificationsUrl:
              'https://public.govdelivery.com/accounts/CAMTC/signup/36832',
            helpCenterUrl: `${jurisdiction.publicUrl}/help/questions#how-do-lottery-results-work-section`,
          }),
        },
        'lotteryPublishedApplicant',
        true,
      );
    }
  }

  // Useful for GovSend where we can't send entities, so we'll output certain strings raw but we want to
  // ensure we don't let real HTML through which is an XSS risk
  stripAngleBrackets(markup: string): string {
    return markup.replace(/[<>]/g, '');
  }

  formatLocalDate(rawDate: string | Date, format: string): string {
    const utcDate = dayjs.utc(rawDate);
    return utcDate.format(format);
  }

  formatPricing = (values: number[]): string => {
    const minPrice = Math.min(...values);
    const maxPrice = Math.max(...values);
    return `$${minPrice.toLocaleString()}${
      minPrice !== maxPrice ? ' - $' + maxPrice.toLocaleString() : ''
    } per month`;
  };

  formatUnitDetails = (
    units: Unit[],
    field: string,
    label: string,
    pluralLabel?: string,
  ): string => {
    const mappedField = units.reduce((values, unit) => {
      if (unit[field]) {
        values.push(Number.parseFloat(unit[field]));
      }
      return values;
    }, []);
    if (mappedField?.length) {
      const minValue = Math.min(...mappedField);
      const maxValue = Math.max(...mappedField);
      return `, ${minValue.toLocaleString()}${
        minValue !== maxValue ? ' - ' + maxValue.toLocaleString() : ''
      } ${pluralLabel && maxValue === 1 ? pluralLabel : label}`;
    }
    return '';
  };

  formatCommunityType = {
    senior55: 'Seniors 55+',
    senior62: 'Seniors 62+',
    specialNeeds: 'Special Needs',
    developmentalDisability: 'Developmental Disability',
    farmworkerHousing: 'Farmworker Housing',
    housingVoucher: 'HCV/Section 8 Voucher',
    senior: 'Seniors',
    seniorVeterans: 'Senior Veteran',
    veteran: 'Veteran',
    schoolEmployee: 'School Employee',
  };
}
