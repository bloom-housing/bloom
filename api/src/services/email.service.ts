import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ResponseError } from '@sendgrid/helpers/classes';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
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
import { SendGridService } from './sendgrid.service';
import { ApplicationCreate } from '../dtos/applications/application-create.dto';
import { User } from '../dtos/users/user.dto';
import Unit from '../dtos/units/unit.dto';
dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(advanced);

type EmailAttachmentData = {
  data: string;
  name: string;
  type: string;
};

type listingInfo = {
  id: string;
  name: string;
  juris: string;
};

@Injectable()
export class EmailService {
  polyglot: Polyglot;

  constructor(
    private readonly sendGrid: SendGridService,
    private readonly configService: ConfigService,
    private readonly translationService: TranslationService,
    private readonly jurisdictionService: JurisdictionService,
    private readonly httpService: HttpService,
  ) {
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

  private async send(
    to: string | string[],
    from: string,
    subject: string,
    body: string,
    retry = 3,
    attachment?: EmailAttachmentData,
  ) {
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
    const handleError = (error) => {
      if (error instanceof ResponseError) {
        const { response } = error;
        const { body: errBody } = response;
        console.error(
          `Error sending email to: ${
            isMultipleRecipients ? to.toString() : to
          }! Error body: ${errBody}`,
        );
        if (retry > 0) {
          void this.send(to, from, subject, body, retry - 1);
        }
      }
    };
    await this.sendGrid.send(emailParams, isMultipleRecipients, handleError);
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

  private async getEmailToSendFrom(
    jurisdictionIds: IdDTO[],
    jurisdiction: Jurisdiction,
  ): Promise<string> {
    if (jurisdiction) {
      return jurisdiction.emailFromAddress;
    }
    // An admin will be attached to more than one jurisdiction so we want generic translations
    // but still need an email to send from
    if (jurisdictionIds.length > 1) {
      const firstJurisdiction = await this.jurisdictionService.findOne({
        jurisdictionId: jurisdictionIds[0].id,
      });
      return firstJurisdiction?.emailFromAddress || '';
    }
    return '';
  }

  /* Send welcome email to new public users */
  public async welcome(
    jurisdictionName: string,
    user: User,
    appUrl: string,
    confirmationUrl: string,
  ) {
    const jurisdiction = await this.getJurisdiction(null, jurisdictionName);
    await this.loadTranslations(jurisdiction, user.language);
    await this.send(
      user.email,
      jurisdiction.emailFromAddress,
      this.polyglot.t('register.welcome'),
      this.template('register-email')({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl: appUrl },
      }),
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
    const emailFromAddress = await this.getEmailToSendFrom(
      jurisdictionIds,
      jurisdiction,
    );
    await this.send(
      user.email,
      emailFromAddress,
      this.polyglot.t('invite.hello'),
      this.template('invite')({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl },
      }),
    );
  }

  /* send account update email */
  async portalAccountUpdate(
    jurisdictionIds: IdDTO[],
    user: User,
    appUrl: string,
  ) {
    const jurisdiction = await this.getJurisdiction(jurisdictionIds);
    void (await this.loadTranslations(jurisdiction, user.language));
    const emailFromAddress = await this.getEmailToSendFrom(
      jurisdictionIds,
      jurisdiction,
    );
    await this.send(
      user.email,
      emailFromAddress,
      this.polyglot.t('invite.portalAccountUpdate'),
      this.template('portal-account-update')({
        user,
        appUrl,
      }),
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
    await this.send(
      newEmail,
      jurisdiction.emailFromAddress,
      'Bloom email change request',
      this.template('change-email')({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl: appUrl },
      }),
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
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;
    const emailFromAddress = await this.getEmailToSendFrom(
      jurisdictionIds,
      jurisdiction,
    );

    await this.send(
      user.email,
      emailFromAddress,
      this.polyglot.t('forgotPassword.subject'),
      compiledTemplate({
        resetUrl: resetUrl,
        resetOptions: { appUrl: appUrl },
        user: user,
      }),
    );
  }

  public async sendMfaCode(user: User, singleUseCode: string) {
    const jurisdiction = await this.getJurisdiction(user.jurisdictions);
    void (await this.loadTranslations(jurisdiction, user.language));
    const emailFromAddress = await this.getEmailToSendFrom(
      user.jurisdictions,
      jurisdiction,
    );
    await this.send(
      user.email,
      emailFromAddress,
      'Partners Portal account access token',
      this.template('mfa-code')({
        user: user,
        mfaCodeOptions: { singleUseCode },
      }),
    );
  }

  public async sendSingleUseCode(user: User, singleUseCode: string) {
    const jurisdiction = await this.getJurisdiction(user.jurisdictions);
    void (await this.loadTranslations(jurisdiction, user.language));
    const emailFromAddress = await this.getEmailToSendFrom(
      user.jurisdictions,
      jurisdiction,
    );
    await this.send(
      user.email,
      emailFromAddress,
      user.confirmedAt
        ? `Code for your ${jurisdiction.name} sign-in`
        : `${jurisdiction.name} verification code`,
      this.template('single-use-code')({
        user: user,
        singleUseCodeOptions: {
          singleUseCode,
          jurisdictionName: jurisdiction.name,
        },
      }),
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
    if (listing.reviewOrderType === ReviewOrderTypeEnum.firstComeFirstServe) {
      eligibleText = this.polyglot.t('confirmation.eligible.fcfs');
      preferenceText = this.polyglot.t('confirmation.eligible.fcfsPreference');
    }
    if (listing.reviewOrderType === ReviewOrderTypeEnum.lottery) {
      eligibleText = this.polyglot.t('confirmation.eligible.lottery');
      preferenceText = this.polyglot.t(
        'confirmation.eligible.lotteryPreference',
      );
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

    await this.send(
      application.applicant.emailAddress,
      jurisdiction.emailFromAddress,
      this.polyglot.t('confirmation.subject'),
      compiledTemplate({
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
        contactText,
        nextStepsUrl:
          nextStepsUrl != 'confirmation.nextStepsUrl' ? nextStepsUrl : null,
        user,
      }),
    );
  }

  public async requestApproval(
    jurisdictionId: IdDTO,
    listingInfo: IdDTO,
    emails: string[],
    appUrl: string,
  ) {
    try {
      const jurisdiction = await this.getJurisdiction([jurisdictionId]);
      void (await this.loadTranslations(jurisdiction));
      await this.send(
        emails,
        jurisdiction.emailFromAddress,
        this.polyglot.t('requestApproval.header'),
        this.template('request-approval')({
          appOptions: { listingName: listingInfo.name },
          appUrl: appUrl,
          listingUrl: `${appUrl}/listings/${listingInfo.id}`,
        }),
      );
    } catch (err) {
      console.log('Request approval email failed', err);
      throw new HttpException('email failed', 500);
    }
  }

  public async changesRequested(
    user: User,
    listingInfo: listingInfo,
    emails: string[],
    appUrl: string,
  ) {
    try {
      const jurisdiction = listingInfo.juris
        ? await this.getJurisdiction([{ id: listingInfo.juris }])
        : user.jurisdictions[0];
      void (await this.loadTranslations(jurisdiction));
      await this.send(
        emails,
        jurisdiction.emailFromAddress,
        this.polyglot.t('changesRequested.header'),
        this.template('changes-requested')({
          appOptions: { listingName: listingInfo.name },
          appUrl: appUrl,
          listingUrl: `${appUrl}/listings/${listingInfo.id}`,
        }),
      );
    } catch (err) {
      console.log('changes requested email failed', err);
      throw new HttpException('email failed', 500);
    }
  }

  public async listingApproved(
    jurisdictionId: IdDTO,
    listingInfo: IdDTO,
    emails: string[],
    publicUrl: string,
  ) {
    try {
      const jurisdiction = await this.getJurisdiction([jurisdictionId]);
      void (await this.loadTranslations(jurisdiction));
      await this.send(
        emails,
        jurisdiction.emailFromAddress,
        this.polyglot.t('listingApproved.header'),
        this.template('listing-approved')({
          appOptions: { listingName: listingInfo.name },
          listingUrl: `${publicUrl}/listing/${listingInfo.id}`,
        }),
      );
    } catch (err) {
      console.log('listing approval email failed', err);
      throw new HttpException('email failed', 500);
    }
  }

  /**
   *
   * @param jurisdictionIds the set of jurisdicitons for the user (sent as IdDTO[]
   * @param user the user that should received the csv export
   * @param csvData the data that makes up the content of the csv to be sent as an attachment
   * @param exportEmailTitle the title of the email ('User Export' is an example)
   * @param exportEmailFileDescription describes what is being sent. Completes the line:
     'The attached file is %{fileDescription}. If you have any questions, please reach out to your administrator.
   */
  async sendCSV(
    jurisdictionIds: IdDTO[],
    user: User,
    csvData: string,
    exportEmailTitle: string,
    exportEmailFileDescription: string,
  ): Promise<void> {
    const jurisdiction = await this.getJurisdiction(jurisdictionIds);
    void (await this.loadTranslations(jurisdiction, user.language));
    const emailFromAddress = await this.getEmailToSendFrom(
      user.jurisdictions,
      jurisdiction,
    );
    await this.send(
      user.email,
      emailFromAddress,
      exportEmailTitle,
      this.template('csv-export')({
        user: user,
        appOptions: {
          title: exportEmailTitle,
          fileDescription: exportEmailFileDescription,
          appUrl: process.env.PARTNERS_PORTAL_URL,
        },
      }),
      undefined,
      {
        data: csvData,
        name: `users-${this.formatLocalDate(
          new Date(),
          'YYYY-MM-DD_HH:mm:ss',
        )}.csv`,
        type: 'text/csv',
      },
    );
  }

  public async listingOpportunity(listing: Listing) {
    const jurisdiction = await this.getJurisdiction([listing.jurisdictions]);
    void (await this.loadTranslations(jurisdiction, LanguagesEnum.en));
    const compiledTemplate = this.template('listing-opportunity');

    if (this.configService.get<string>('NODE_ENV') == 'production') {
      Logger.log(
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
        value: dayjs(listing.applicationDueDate).format('MMMM D, YYYY'),
      });
    }
    tableRows.push({
      label: this.polyglot.t('rentalOpportunity.address'),
      value: `${listing.listingsBuildingAddress.street}, ${listing.listingsBuildingAddress.city} ${listing.listingsBuildingAddress.state} ${listing.listingsBuildingAddress.zipCode}`,
    });
    Object.entries(units.bedrooms).forEach(([key, bedroom]) => {
      const sqFtString = this.formatUnitDetails(bedroom, 'sqFeet', 'sqft');
      const bathroomstring = this.formatUnitDetails(
        bedroom,
        'numBathrooms',
        'bath',
        'baths',
      );
      tableRows.push({
        label: this.polyglot.t(`rentalOpportunity.${key}`),
        value: `${bedroom.length} unit${
          bedroom.length > 1 ? 's' : ''
        }${bathroomstring}${sqFtString}`,
      });
    });
    if (units.rent?.length) {
      tableRows.push({
        label: this.polyglot.t('rentalOpportunity.rent'),
        value: this.formatPricing(units.rent),
      });
    }
    if (units.minIncome?.length) {
      tableRows.push({
        label: this.polyglot.t('rentalOpportunity.minIncome'),
        value: this.formatPricing(units.minIncome),
      });
    }
    if (units.maxIncome?.length) {
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
        tableRows.push({
          label: this.polyglot.t('rentalOpportunity.lottery'),
          value: dayjs(lotteryEvent.startDate).format('MMMM D, YYYY'),
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
      listingName: listing.name,
      tableRows,
      languageUrls,
    });

    await this.govSend(compiled, 'New rental opportunity');
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
  };
}
