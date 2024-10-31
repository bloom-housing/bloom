import { Injectable, Logger } from '@nestjs/common';
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
import * as aws from '@aws-sdk/client-ses';
import nodemailer, { SendMailOptions } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
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

@Injectable()
export class EmailService {
  polyglot: Polyglot;
  transporter: Mail;

  constructor(
    private readonly configService: ConfigService,
    private readonly translationService: TranslationService,
    private readonly jurisdictionService: JurisdictionService,
    private readonly httpService: HttpService,
  ) {
    const sesClient = new aws.SESClient({
      region: process.env.AWS_REGION,
    });

    this.transporter = nodemailer.createTransport({
      SES: { ses: sesClient, aws },
    });

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

  public async sendSES(mailOptions: SendMailOptions) {
    if (Array.isArray(mailOptions.to) && mailOptions.to.length === 0) return;
    try {
      return await this.transporter.sendMail({
        ...mailOptions,
        from: 'Doorway <no-reply@housingbayarea.org>',
      });
    } catch (e) {
      console.log(e);
      console.error('Failed to send email');
      return e;
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

    await this.sendSES({
      to: user.email,
      subject: this.polyglot.t('register.welcome'),
      html: this.template('register-email')({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl: baseUrl },
      }),
    });
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

    await this.sendSES({
      to: user.email,
      subject: this.polyglot.t('invite.hello'),
      html: this.template('invite')({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl },
      }),
    });
  }

  /* send account update email */
  async portalAccountUpdate(
    jurisdictionIds: IdDTO[],
    user: User,
    appUrl: string,
  ) {
    const jurisdiction = await this.getJurisdiction(jurisdictionIds);
    void (await this.loadTranslations(jurisdiction, user.language));

    await this.sendSES({
      to: user.email,
      subject: this.polyglot.t('invite.portalAccountUpdate'),
      html: this.template('portal-account-update')({
        user,
        appUrl,
      }),
    });
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

    await this.sendSES({
      to: newEmail,
      subject: 'Bloom email change request',
      html: this.template('change-email')({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl: appUrl },
      }),
    });
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

    await this.sendSES({
      to: user.email,
      subject: this.polyglot.t('forgotPassword.subject'),
      text: 'Text version',
      html: compiledTemplate({
        resetUrl: resetUrl,
        resetOptions: { appUrl: baseUrl },
        user: user,
      }),
    });
  }

  public async sendMfaCode(user: User, singleUseCode: string) {
    const jurisdiction = await this.getJurisdiction(user.jurisdictions);
    void (await this.loadTranslations(jurisdiction, user.language));

    await this.sendSES({
      to: user.email,
      subject: `${singleUseCode} is your secure Partners Portal account access token`,
      text: 'Text version',
      html: this.template('mfa-code')({
        user: user,
        mfaCodeOptions: { singleUseCode },
      }),
    });
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

    await this.sendSES({
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
    });
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

    await this.sendSES({
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
    });
  }

  public async requestApproval(
    jurisdictionId: IdDTO,
    listingInfo: IdDTO,
    emails: string[],
    appUrl: string,
  ) {
    const jurisdiction = await this.getJurisdiction([jurisdictionId]);
    void (await this.loadTranslations(jurisdiction));

    await this.sendSES({
      to: emails,
      subject: this.polyglot.t('requestApproval.header'),
      html: this.template('request-approval')({
        appOptions: { listingName: listingInfo.name },
        appUrl: appUrl,
        listingUrl: `${appUrl}/listings/${listingInfo.id}`,
      }),
    });
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

    await this.sendSES({
      to: emails,
      subject: this.polyglot.t('changesRequested.header'),
      html: this.template('changes-requested')({
        appOptions: { listingName: listingInfo.name },
        appUrl: appUrl,
        listingUrl: `${appUrl}/listings/${listingInfo.id}`,
      }),
    });
  }

  public async listingApproved(
    jurisdictionId: IdDTO,
    listingInfo: IdDTO,
    emails: string[],
    publicUrl: string,
  ) {
    const jurisdiction = await this.getJurisdiction([jurisdictionId]);
    void (await this.loadTranslations(jurisdiction));

    await this.sendSES({
      to: emails,
      subject: this.polyglot.t('listingApproved.header'),
      html: this.template('listing-approved')({
        appOptions: { listingName: listingInfo.name },
        listingUrl: `${publicUrl}/listing/${listingInfo.id}`,
      }),
    });
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
    await this.sendSES({
      to: emails,
      subject: this.polyglot.t('lotteryReleased.header', {
        listingName: listingInfo.name,
      }),
      html: this.template('lottery-released')({
        appOptions: { listingName: listingInfo.name },
        appUrl: appUrl,
        listingUrl: `${appUrl}/listings/${listingInfo.id}`,
      }),
    });
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
    await this.sendSES({
      to: emails,
      subject: this.polyglot.t('lotteryPublished.header', {
        listingName: listingInfo.name,
      }),
      html: this.template('lottery-published-admin')({
        appOptions: { listingName: listingInfo.name, appUrl: appUrl },
      }),
    });
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
      await this.sendSES({
        to: emails[language],

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
          // These three URLs are placeholders and must be updated per jurisdiction
          notificationsUrl: 'https://www.exygy.com',
          helpCenterUrl: 'https://www.exygy.com',
        }),
      });
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
  };
}
