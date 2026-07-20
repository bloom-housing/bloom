import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import Handlebars from 'handlebars';
import Polyglot from 'node-polyglot';
import path from 'path';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import {
  LanguagesEnum,
  ListingEventsTypeEnum,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import { JurisdictionService } from './jurisdiction.service';
import {
  EmailProvider,
  SendEmailInput,
  EmailAttachmentData,
} from './email-provider.service';
import { TranslationService } from './translation.service';
import { Application } from '../dtos/applications/application.dto';
import { Jurisdiction } from '../dtos/jurisdictions/jurisdiction.dto';
import { Listing } from '../dtos/listings/listing.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { User } from '../dtos/users/user.dto';
import { FeatureFlagEnum } from '../enums/feature-flags/feature-flags-enum';
import { JurisdictionViews } from '../enums/jurisdictions/view-enum';
import { doJurisdictionHaveFeatureFlagSet } from '../utilities/feature-flag-utilities';
import { getPublicEmailURL } from '../utilities/get-public-email-url';
import type { ApplicationStatusChangeItem } from '../utilities/applicationStatusChanges';
import {
  ListingUnitsSummary,
  oneLineAddress,
  summarizeListingUnitsByType,
} from '../utilities/listing-data-formatters';
import { unitTypeMapping } from '../../prisma/seed-helpers/unit-type-factory';
import { UnitAccessibilityPriorityTypeEnum } from '../enums/units/accessibility-priority-type-enum';
import { GovDeliveryService } from './gov-delivery.service';
dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(advanced);

type listingInfo = {
  id: string;
  name: string;
  juris: string;
};

export type ListingNotificationVariant = 'standard' | 'comingSoon';

@Injectable()
export class EmailService {
  polyglot: Polyglot;

  constructor(
    private readonly emailProvider: EmailProvider,
    private readonly translationService: TranslationService,
    private readonly jurisdictionService: JurisdictionService,
    private readonly govDeliveryService: GovDeliveryService,
    @Inject(Logger)
    private logger = new Logger(EmailService.name),
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
    Handlebars.registerHelper('or', function (...args) {
      // Remove the last argument (Handlebars options object)
      args.pop();
      return args.some((arg) => arg);
    });
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

  private async send(
    to: string | string[],
    from: string,
    subject: string,
    body: string,
    attachment?: EmailAttachmentData,
  ) {
    const isMultipleRecipients = Array.isArray(to);
    if (isMultipleRecipients && to.length === 0) {
      console.warn(
        'Got email send request with empty array for the "to" field. Doing nothing.',
      );
      return;
    }

    const emailParams: SendEmailInput = {
      to,
      from,
      subject,
      body,
      attachment,
    };
    await this.emailProvider.send(emailParams);
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
        view: JurisdictionViews.full,
      });
    } else if (jurisdictionName) {
      return await this.jurisdictionService.findOne({
        jurisdictionName: jurisdictionName,
        view: JurisdictionViews.full,
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
        view: JurisdictionViews.full,
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
    const baseUrl = appUrl ? new URL(appUrl).origin : undefined;
    await this.loadTranslations(jurisdiction, user.language);
    await this.send(
      user.email,
      jurisdiction.emailFromAddress,
      this.polyglot.t('register.welcome'),
      this.template('register-email')({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl: baseUrl },
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
    const resetUrl = getPublicEmailURL(appUrl, resetToken, '/reset-password');
    const baseUrl = appUrl ? new URL(appUrl).origin : undefined;
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
        resetOptions: { appUrl: baseUrl },
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
      `${singleUseCode} is your secure Partners Portal account access token`,
      this.template('mfa-code')({
        user: user,
        mfaCodeOptions: { singleUseCode },
      }),
    );
  }

  public async sendSingleUseCode(
    user: User,
    singleUseCode: string,
    jurisdictionName?: string,
  ) {
    const jurisdiction = await this.getJurisdiction(
      user.jurisdictions,
      jurisdictionName,
    );
    void (await this.loadTranslations(jurisdiction, user.language));
    const emailFromAddress = await this.getEmailToSendFrom(
      user.jurisdictions,
      jurisdiction,
    );
    await this.send(
      user.email,
      emailFromAddress,
      user.confirmedAt
        ? `${singleUseCode} is your secure ${jurisdiction.name} sign-in code`
        : `${singleUseCode} is your secure ${jurisdiction.name} verification code`,
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
    application: Application,
    appUrl: string,
    isAdvocate = false,
  ) {
    const jurisdiction = await this.getJurisdiction([listing.jurisdictions]);
    const enableUnitGroups = doJurisdictionHaveFeatureFlagSet(
      jurisdiction,
      FeatureFlagEnum.enableUnitGroups,
    );
    const listingUrl = `${appUrl}/listing/${listing.id}`;
    const compiledTemplate = this.template('confirmation');

    const buildEligibilityCopy = (
      isAdvocate = false,
      isAdvocateClient = false,
    ) => {
      let eligibleText: string = null;
      let preferenceText: string = null;
      let contactText: string = null;
      const waitlistContactKey =
        isAdvocate && !isAdvocateClient
          ? 'confirmation.eligible.waitlistContactAdvocate'
          : 'confirmation.eligible.waitlistContact';

      if (enableUnitGroups) {
        const hasUnitGroups = listing.unitGroups?.length > 0;
        const unitsAvailable =
          listing.unitGroups?.length > 0
            ? listing.unitGroups.reduce(
                (acc, curr) => acc + curr.totalAvailable,
                0,
              )
            : listing.unitsAvailable;

        if (listing.reviewOrderType === ReviewOrderTypeEnum.lottery) {
          eligibleText = this.polyglot.t('confirmation.eligible.lottery');
          preferenceText = this.polyglot.t(
            'confirmation.eligible.lotteryPreference',
          );
        } else if (unitsAvailable) {
          eligibleText = this.polyglot.t('confirmation.eligible.fcfs');
          preferenceText = this.polyglot.t(
            'confirmation.eligible.fcfsPreference',
          );
        } else if (hasUnitGroups) {
          if (listing.reviewOrderType === ReviewOrderTypeEnum.waitlistLottery) {
            eligibleText = this.polyglot.t(
              'confirmation.eligible.waitlistLottery',
            );
          } else {
            eligibleText = this.polyglot.t('confirmation.eligible.waitlist');
          }
          contactText = this.polyglot.t(waitlistContactKey);
          preferenceText = this.polyglot.t(
            'confirmation.eligible.waitlistPreference',
          );
        }
      } else {
        if (
          listing.reviewOrderType === ReviewOrderTypeEnum.firstComeFirstServe
        ) {
          eligibleText = this.polyglot.t('confirmation.eligible.fcfs');
          preferenceText = this.polyglot.t(
            'confirmation.eligible.fcfsPreference',
          );
        }
        if (listing.reviewOrderType === ReviewOrderTypeEnum.lottery) {
          eligibleText = this.polyglot.t('confirmation.eligible.lottery');
          preferenceText = this.polyglot.t(
            'confirmation.eligible.lotteryPreference',
          );
        }
        if (listing.reviewOrderType === ReviewOrderTypeEnum.waitlist) {
          eligibleText = this.polyglot.t('confirmation.eligible.waitlist');
          contactText = this.polyglot.t(waitlistContactKey);
          preferenceText = this.polyglot.t(
            'confirmation.eligible.waitlistPreference',
          );
        }
        if (listing.reviewOrderType === ReviewOrderTypeEnum.waitlistLottery) {
          eligibleText = this.polyglot.t(
            'confirmation.eligible.waitlistLottery',
          );
          contactText = this.polyglot.t(waitlistContactKey);
          preferenceText = this.polyglot.t(
            'confirmation.eligible.waitlistPreference',
          );
        }
      }

      return {
        eligibleText,
        preferenceText,
        contactText,
      };
    };

    const user = {
      firstName: application.applicant.firstName,
      middleName: application.applicant.middleName,
      lastName: application.applicant.lastName,
    };
    const sendConfirmationEmail = async (
      recipientEmail: string,
      language?: LanguagesEnum,
      isAdvocate = false,
      isAdvocateClient = false,
    ) => {
      await this.loadTranslations(jurisdiction, language);
      const { eligibleText, preferenceText, contactText } =
        buildEligibilityCopy(isAdvocate, isAdvocateClient);
      const nextStepsUrl = this.polyglot.t('confirmation.nextStepsUrl');

      await this.send(
        recipientEmail,
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
          interviewText: this.polyglot.t(
            isAdvocate && !isAdvocateClient
              ? 'confirmation.interviewAdvocate'
              : 'confirmation.interview',
          ),
          eligibleText,
          contactText,
          nextStepsUrl:
            nextStepsUrl != 'confirmation.nextStepsUrl' ? nextStepsUrl : null,
          contactSectionHeader: this.polyglot.t(
            isAdvocateClient
              ? 'confirmation.questions'
              : 'confirmation.needToMakeUpdates',
          ),
          contactSectionBody: this.polyglot.t(
            isAdvocateClient
              ? 'leasingAgent.contactAgentForQuestions'
              : 'leasingAgent.contactAgentToUpdateInfo',
          ),
          introText: this.polyglot.t(
            isAdvocateClient
              ? 'confirmation.gotYourConfirmationNumberOnYourBehalf'
              : 'confirmation.gotYourConfirmationNumber',
          ),
          user,
        }),
      );
    };

    const applicantEmail = application?.applicant?.emailAddress;

    if (isAdvocate) {
      const advocateEmail = application?.alternateContact?.emailAddress;
      await sendConfirmationEmail(
        advocateEmail,
        application.language,
        isAdvocate,
        false,
      );
      if (applicantEmail) {
        await sendConfirmationEmail(
          applicantEmail,
          LanguagesEnum.en,
          isAdvocate,
          true,
        );
      }
      return;
    }

    await sendConfirmationEmail(
      applicantEmail,
      application.language,
      isAdvocate,
      false,
    );
  }

  public async applicationUpdateEmail(
    listingName: string,
    jurisdictionId: IdDTO,
    application: Application,
    changes: ApplicationStatusChangeItem[],
    appUrl: string,
    isAdvocate = false,
    advocateEmail?: string,
  ) {
    const jurisdiction = await this.getJurisdiction([jurisdictionId]);
    const contactEmail = process.env.CONTACT_EMAIL;
    const buildSummaryItems = () =>
      changes.map((change) => {
        if (change.type === 'status') {
          const fromLabel = this.polyglot.t(
            `applicationUpdate.applicationStatus.${change.from}`,
          );
          const toLabel = this.polyglot.t(
            `applicationUpdate.applicationStatus.${change.to}`,
          );
          return new Handlebars.SafeString(
            this.polyglot.t('applicationUpdate.statusChange', {
              from: `<strong>${fromLabel}</strong>`,
              to: `<strong>${toLabel}</strong>`,
            }),
          );
        }
        if (change.type === 'declineReason') {
          const reasonLabel = this.polyglot.t(
            `applicationUpdate.declineReason.${change.value}`,
          );
          return new Handlebars.SafeString(
            this.polyglot.t('applicationUpdate.declineReasonChange', {
              value: `<strong>${reasonLabel}</strong>`,
            }),
          );
        }
        if (change.type === 'accessibleWaitlist') {
          return new Handlebars.SafeString(
            this.polyglot.t('applicationUpdate.accessibleWaitListChange', {
              value: `<strong>${change.value}</strong>`,
            }),
          );
        }
        return new Handlebars.SafeString(
          this.polyglot.t('applicationUpdate.conventionalWaitListChange', {
            value: `<strong>${change.value}</strong>`,
          }),
        );
      });

    const subjectForCurrentLanguage = () =>
      this.polyglot.t('applicationUpdate.subject', {
        listingName: listingName,
      });
    const actionUrl = appUrl ? `${appUrl}/account/applications` : '';
    const housingApplicantName = [
      application?.applicant?.firstName,
      application?.applicant?.lastName,
    ]
      .filter(Boolean)
      .join(' ');
    const advocateName = [
      application?.alternateContact?.firstName,
      application?.alternateContact?.lastName,
    ]
      .filter(Boolean)
      .join(' ');

    if (isAdvocate && advocateEmail) {
      void (await this.loadTranslations(jurisdiction, application.language));
      await this.send(
        advocateEmail,
        jurisdiction.emailFromAddress,
        subjectForCurrentLanguage(),
        this.template('application-update')({
          appOptions: { listingName: listingName },
          recipientName: advocateName,
          summaryItems: buildSummaryItems(),
          actionUrl,
          contactEmail,
          updateNoticeText: this.polyglot.t(
            'applicationUpdate.advocateUpdateNotice',
            {
              applicantName: housingApplicantName,
              listingName: listingName,
            },
          ),
          contactNoticeText: this.polyglot.t('applicationUpdate.contactNotice'),
          viewPromptText: this.polyglot.t(
            'applicationUpdate.advocateViewPrompt',
          ),
          viewLinkText: this.polyglot.t('applicationUpdate.advocateViewLink'),
          showViewSection: true,
        }),
      );
    }

    if (application?.applicant?.emailAddress) {
      void (await this.loadTranslations(
        jurisdiction,
        isAdvocate ? LanguagesEnum.en : application.language,
      ));
      const applicantName = [
        application.applicant.firstName,
        application.applicant.lastName,
      ]
        .filter(Boolean)
        .join(' ');
      await this.send(
        application.applicant.emailAddress,
        jurisdiction.emailFromAddress,
        subjectForCurrentLanguage(),
        this.template('application-update')({
          appOptions: { listingName: listingName },
          recipientName: applicantName,
          summaryItems: buildSummaryItems(),
          contactEmail,
          updateNoticeText: this.polyglot.t('applicationUpdate.updateNotice', {
            listingName: listingName,
          }),
          contactNoticeText: isAdvocate
            ? this.polyglot.t('applicationUpdate.applicantContactNotice')
            : this.polyglot.t('applicationUpdate.contactNotice'),
          actionUrl,
          viewPromptText: this.polyglot.t('applicationUpdate.viewPrompt'),
          viewLinkText: this.polyglot.t('applicationUpdate.viewLink'),
          showViewSection: !isAdvocate,
        }),
      );
    }
  }

  public async requestApproval(
    jurisdictionId: IdDTO,
    listingInfo: IdDTO,
    listingFileNumber: string,
    emails: string[],
    appUrl: string,
  ) {
    try {
      const jurisdiction = await this.getJurisdiction([jurisdictionId]);
      void (await this.loadTranslations(jurisdiction));
      this.logger.log(
        `Sending request approval email for listing ${listingInfo.name} to ${emails.length} emails`,
      );
      const appOptions = {
        listingName: listingInfo.name,
        listingFileNumber,
      };
      await this.send(
        emails,
        jurisdiction.emailFromAddress,
        `${this.polyglot.t('requestApproval.header')} - ${listingInfo.name}`,
        this.template('request-approval')({
          appOptions,
          listingFileNumber,
          appUrl: appUrl,
          listingUrl: `${appUrl}/listings/${listingInfo.id}`,
        }),
      );
    } catch (err) {
      this.logger.log('Request approval email failed', err);
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
      this.logger.log(
        `Sending changes requested email for listing ${listingInfo.name} to ${emails.length} emails`,
      );
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
      this.logger.log('changes requested email failed', err);
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
      this.logger.log(
        `Sending listing approved email for listing ${listingInfo.name} to ${emails.length} emails`,
      );
      await this.send(
        emails,
        jurisdiction.emailFromAddress,
        this.polyglot.t('listingApproved.header', {
          listingName: listingInfo.name,
        }),
        this.template('listing-approved')({
          appOptions: { listingName: listingInfo.name },
          listingUrl: `${publicUrl}/listing/${listingInfo.id}`,
        }),
      );
    } catch (err) {
      this.logger.log('listing approval email failed', err);
      throw new HttpException('email failed', 500);
    }
  }

  public async listingScheduled(
    jurisdictionId: IdDTO,
    listingInfo: IdDTO,
    emails: string[],
    scheduledPublishAt: Date,
  ) {
    try {
      const jurisdiction = await this.getJurisdiction([jurisdictionId]);
      void (await this.loadTranslations(jurisdiction));
      this.logger.log(
        `Sending listing scheduled email for listing ${listingInfo.name} to ${emails.length} emails`,
      );

      const formattedDate = dayjs
        .utc(scheduledPublishAt)
        .tz(process.env.TIME_ZONE)
        .format('MM/DD/YYYY');

      await this.send(
        emails,
        jurisdiction.emailFromAddress,
        this.polyglot.t('listingScheduled.subject', {
          listingName: listingInfo.name,
        }),
        this.template('listing-scheduled')({
          appOptions: { listingName: listingInfo.name, date: formattedDate },
        }),
      );
    } catch (err) {
      this.logger.log('listing scheduled email failed', err);
      throw new HttpException('email failed', 500);
    }
  }

  public async listingPublished(
    jurisdictionId: IdDTO,
    listingInfo: IdDTO,
    emails: string[],
    publicUrl: string,
  ) {
    try {
      const jurisdiction = await this.getJurisdiction([jurisdictionId]);
      void (await this.loadTranslations(jurisdiction));
      this.logger.log(
        `Sending listing published email for listing ${listingInfo.name} to ${emails.length} emails`,
      );
      await this.send(
        emails,
        jurisdiction.emailFromAddress,
        this.polyglot.t('listingPublished.subject', {
          listingName: listingInfo.name,
        }),
        this.template('listing-published')({
          appOptions: { listingName: listingInfo.name },
          listingUrl: `${publicUrl}/listing/${listingInfo.id}`,
        }),
      );
    } catch (err) {
      this.logger.log('listing published email failed', err);
      throw new HttpException('email failed', 500);
    }
  }

  public async applicationScriptRunner(
    application: Application,
    jurisdictionId: IdDTO,
  ) {
    const jurisdiction = await this.getJurisdiction([jurisdictionId]);
    void (await this.loadTranslations(jurisdiction, application.language));
    const compiledTemplate = this.template('script-runner');

    const user = {
      firstName: application.applicant.firstName,
      middleName: application.applicant.middleName,
      lastName: application.applicant.lastName,
    };
    await this.send(
      application.applicant.emailAddress,
      jurisdiction.emailFromAddress,
      this.polyglot.t('scriptRunner.subject'),
      compiledTemplate({
        application,
        user,
      }),
    );
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

  public async lotteryReleased(
    listingInfo: listingInfo,
    emails: string[],
    appUrl: string,
  ) {
    try {
      const jurisdiction = await this.getJurisdiction([
        { id: listingInfo.juris },
      ]);
      void (await this.loadTranslations(jurisdiction));
      this.logger.log(
        `Sending lottery released email for listing ${listingInfo.name} to ${emails.length} emails`,
      );
      await this.send(
        emails,
        jurisdiction.emailFromAddress,
        this.polyglot.t('lotteryReleased.header', {
          listingName: listingInfo.name,
        }),
        this.template('lottery-released')({
          appOptions: { listingName: listingInfo.name },
          appUrl: appUrl,
          listingUrl: `${appUrl}/listings/${listingInfo.id}`,
        }),
      );
    } catch (err) {
      this.logger.log('lottery released email failed', err);
      throw new HttpException('email failed', 500);
    }
  }

  public async lotteryPublishedAdmin(
    listingInfo: listingInfo,
    emails: string[],
    appUrl: string,
  ) {
    try {
      const jurisdiction = await this.getJurisdiction([
        { id: listingInfo.juris },
      ]);
      void (await this.loadTranslations(jurisdiction));
      this.logger.log(
        `Sending lottery published admin email for listing ${listingInfo.name} to ${emails.length} emails`,
      );
      await this.send(
        emails,
        jurisdiction.emailFromAddress,
        this.polyglot.t('lotteryPublished.header', {
          listingName: listingInfo.name,
        }),
        this.template('lottery-published-admin')({
          appOptions: { listingName: listingInfo.name, appUrl: appUrl },
        }),
      );
    } catch (err) {
      this.logger.log('lottery published admin email failed', err);
      throw new HttpException('email failed', 500);
    }
  }

  /**
   *
   * @param emails a key in LanguagesEnum to a list of emails of applicants who submitted in that language
   */
  public async lotteryPublishedApplicant(
    listingInfo: listingInfo,
    emails: { [key: string]: string[] },
  ) {
    try {
      const jurisdiction = await this.getJurisdiction([
        { id: listingInfo.juris },
      ]);

      for (const language in emails) {
        void (await this.loadTranslations(
          jurisdiction,
          language as LanguagesEnum,
        ));
        this.logger.log(
          `Sending lottery published ${language} email for listing ${listingInfo.name} to ${emails[language]?.length} emails`,
        );
        await this.send(
          emails[language],
          jurisdiction.emailFromAddress,
          this.polyglot.t('lotteryAvailable.header', {
            listingName: listingInfo.name,
          }),
          this.template('lottery-published-applicant')({
            appOptions: {
              listingName: listingInfo.name,
              appUrl: jurisdiction.publicUrl,
            },
            signInUrl: `${jurisdiction.publicUrl}/${language}/sign-in`,
            // These two URLs are placeholders and must be updated per jurisdiction
            notificationsUrl: 'https://www.exygy.com',
            helpCenterUrl: 'https://www.exygy.com',
          }),
        );
      }
    } catch (err) {
      this.logger.log('lottery published applicant email failed', err);
      throw new HttpException('email failed', 500);
    }
  }

  public async warnOfAccountRemoval(user: User) {
    const jurisdiction = await this.getJurisdiction(user.jurisdictions);
    void (await this.loadTranslations(jurisdiction, user.language));
    const emailFromAddress = await this.getEmailToSendFrom(
      user.jurisdictions,
      jurisdiction,
    );
    const signInUrl = jurisdiction ? `${jurisdiction.publicUrl}/sign-in` : '';
    await this.send(
      user.email,
      emailFromAddress,
      this.polyglot.t('accountRemoval.subject'),
      this.template('warn-removal')({
        user: user,
        signInUrl: signInUrl,
      }),
    );
  }

  public async advocateAccepted(user: User, appUrl: string, formUrl: string) {
    const jurisdiction = await this.getJurisdiction(user.jurisdictions);
    void (await this.loadTranslations(jurisdiction, user.language));
    const emailFromAddress = await this.getEmailToSendFrom(
      user.jurisdictions,
      jurisdiction,
    );
    await this.send(
      user.email,
      emailFromAddress,
      this.polyglot.t('advocateApproved.subject'),
      this.template('advocate-approved')({
        user: user,
        formUrl,
        appOptions: { appUrl },
      }),
    );
  }

  public async advocateRejected(user: User, appUrl: string) {
    const jurisdiction = await this.getJurisdiction(user.jurisdictions);
    void (await this.loadTranslations(jurisdiction, user.language));
    const emailFromAddress = await this.getEmailToSendFrom(
      user.jurisdictions,
      jurisdiction,
    );
    await this.send(
      user.email,
      emailFromAddress,
      this.polyglot.t('advocateRejected.subject'),
      this.template('advocate-rejected')({
        user: user,
        contactEmail: process.env.CONTACT_EMAIL,
        appOptions: { appUrl },
      }),
    );
  }

  public buildListingDetails(
    listing: Listing,
    priorityTypes: UnitAccessibilityPriorityTypeEnum[],
    listingUnitsSummary: ListingUnitsSummary,
    variant: ListingNotificationVariant = 'standard',
  ): { label: string; value: string | number }[] {
    const listingDetails: {
      label: string;
      value: string | number;
      bolded?: boolean;
    }[] = [];

    if (listing?.reservedCommunityTypes?.name) {
      listingDetails.push({
        label: this.polyglot.t('rentalOpportunity.community'),
        value: this.polyglot.t(
          `rentalOpportunity.communityType.${listing.reservedCommunityTypes.name}`,
        ),
      });
    }

    if (variant === 'comingSoon' && listing?.scheduledApplicationOpenAt) {
      listingDetails.push({
        label: this.polyglot.t('rentalOpportunity.applicationsOpen'),
        value: this.formatLocalDate(
          listing.scheduledApplicationOpenAt,
          'MMMM DD, YYYY',
        ),
      });
    } else if (listing?.applicationDueDate) {
      listingDetails.push({
        label: this.polyglot.t('rentalOpportunity.applicationsDue'),
        value: dayjs(listing.applicationDueDate)
          .tz(process.env.TIME_ZONE)
          .format('MMMM D, YYYY [at] h:mma z'),
        bolded: true,
      });
    }

    listingDetails.push({
      label: this.polyglot.t('rentalOpportunity.address'),
      value: oneLineAddress(listing.listingsBuildingAddress),
    });

    if (listing.neighborhood) {
      listingDetails.push({
        label: this.polyglot.t('rentalOpportunity.neighborhood'),
        value: listing.neighborhood,
      });
    }

    if (listing.region || listing.configurableRegion) {
      listingDetails.push({
        label: this.polyglot.t('rentalOpportunity.region'),
        value: listing.region ?? listing.configurableRegion,
      });
    }

    if (priorityTypes.length) {
      listingDetails.push({
        label: this.polyglot.t('rentalOpportunity.unitType'),
        value: priorityTypes
          .map((type) =>
            this.polyglot.t(`rentalOpportunity.accessibilityType.${type}`),
          )
          .join(', '),
      });
    }

    if (
      listing.reviewOrderType &&
      (listing.reviewOrderType === ReviewOrderTypeEnum.lottery ||
        listing.reviewOrderType === ReviewOrderTypeEnum.waitlist)
    ) {
      listingDetails.push({
        label: this.polyglot.t('rentalOpportunity.opportunityType'),
        value: this.polyglot.t(`rentalOpportunity.${listing.reviewOrderType}`),
      });
    }

    const unitRowOrder = Object.keys(listingUnitsSummary.units).sort(
      (a, b) => unitTypeMapping[a] - unitTypeMapping[b],
    );

    unitRowOrder.forEach((key) => {
      const { count, baths, sqft } = listingUnitsSummary.units[key];
      let summaryString = `${this.polyglot.t('rentalOpportunity.unitCount', {
        smart_count: count,
      })}`;

      if (baths) {
        summaryString += `, ${
          baths.min === baths.max
            ? this.polyglot.t('rentalOpportunity.bathCount', {
                smart_count: baths.max,
              })
            : `${baths.min} - ${this.polyglot.t('rentalOpportunity.bathCount', {
                smart_count: baths.max,
              })}`
        }`;
      }

      if (sqft) {
        summaryString += `, ${
          sqft.min === sqft.max ? sqft.max : `${sqft.min} - ${sqft.max}`
        } ${this.polyglot.t('rentalOpportunity.sqft')}`;
      }

      listingDetails.push({
        label: this.polyglot.t(`rentalOpportunity.unitTypes.${key}`),
        value: summaryString,
      });
    });

    if (listingUnitsSummary.flatRent || listingUnitsSummary.percentageRent) {
      let rentSummaryValue = '';

      // If a listing has mixed rent type units, show more generic information
      if (listingUnitsSummary.flatRent && listingUnitsSummary.percentageRent) {
        rentSummaryValue = `% ${this.polyglot.t(
          'rentalOpportunity.ofIncome',
        )}, ${this.polyglot.t('rentalOpportunity.orUpTo')} $${
          listingUnitsSummary.flatRent.max
        }`;
      }
      // Otherwise show more specific ranges
      else if (listingUnitsSummary.flatRent) {
        rentSummaryValue =
          listingUnitsSummary.flatRent.max === listingUnitsSummary.flatRent.min
            ? `$${listingUnitsSummary.flatRent.min} ${this.polyglot.t(
                'rentalOpportunity.perMonth',
              )}`
            : `$${listingUnitsSummary.flatRent.min} - $${
                listingUnitsSummary.flatRent.max
              } ${this.polyglot.t('rentalOpportunity.perMonth')}`;
      } else {
        rentSummaryValue =
          listingUnitsSummary.percentageRent.max ===
          listingUnitsSummary.percentageRent.min
            ? `${listingUnitsSummary.percentageRent.min}% ${this.polyglot.t(
                'rentalOpportunity.ofIncome',
              )}`
            : `${listingUnitsSummary.percentageRent.min}% - ${
                listingUnitsSummary.percentageRent.max
              }% ${this.polyglot.t('rentalOpportunity.ofIncome')}`;
      }

      listingDetails.push({
        label: this.polyglot.t('rentalOpportunity.rent'),
        value: rentSummaryValue,
      });
    }

    if (listingUnitsSummary.minIncome) {
      listingDetails.push({
        label: this.polyglot.t('rentalOpportunity.minIncome'),
        value: `${
          listingUnitsSummary.minIncome.min ===
          listingUnitsSummary.minIncome.max
            ? `$${listingUnitsSummary.minIncome.max} ${this.polyglot.t(
                'rentalOpportunity.perMonth',
              )}`
            : `$${listingUnitsSummary.minIncome.min} - $${
                listingUnitsSummary.minIncome.max
              } ${this.polyglot.t('rentalOpportunity.perMonth')}`
        }`,
      });
    }

    if (listingUnitsSummary.maxIncome) {
      listingDetails.push({
        label: this.polyglot.t('rentalOpportunity.maxIncome'),
        value: `${
          listingUnitsSummary.maxIncome.min ===
          listingUnitsSummary.maxIncome.max
            ? `$${listingUnitsSummary.maxIncome.max} ${this.polyglot.t(
                'rentalOpportunity.perMonth',
              )}`
            : `$${listingUnitsSummary.maxIncome.min} - $${
                listingUnitsSummary.maxIncome.max
              } ${this.polyglot.t('rentalOpportunity.perMonth')}`
        }`,
      });
    }

    const lotteryInfo = listing.listingEvents.filter(
      (event) => event.type === ListingEventsTypeEnum.publicLottery,
    );

    if (lotteryInfo.length) {
      listingDetails.push({
        label: this.polyglot.t('rentalOpportunity.lotteryDate'),
        value: this.formatLocalDate(lotteryInfo[0].startDate, 'MMMM DD, YYYY'),
      });
    }
    return listingDetails;
  }

  public async listingPublishNotification(
    jurisdictionId: IdDTO,
    listing: Listing,
    priorityTypes: UnitAccessibilityPriorityTypeEnum[],
    emails: { [key: string]: string[] },
    variant: ListingNotificationVariant = 'standard',
  ) {
    try {
      const jurisdiction = await this.getJurisdiction([jurisdictionId]);
      const listingUnitsSummary = summarizeListingUnitsByType(listing.units);
      const subjectKey =
        variant === 'comingSoon'
          ? 'rentalOpportunity.comingSoon.subject'
          : 'rentalOpportunity.subject';
      const introKey =
        variant === 'comingSoon'
          ? 'rentalOpportunity.comingSoon.intro'
          : 'rentalOpportunity.intro';

      for (const language in emails) {
        if (!emails[language].length) {
          continue;
        }

        void (await this.loadTranslations(
          jurisdiction,
          language as LanguagesEnum,
        ));

        this.logger.log(
          `Sending lottery published ${language} email for listing ${listing.name} to ${emails[language]?.length} emails`,
        );

        const listingDetails = this.buildListingDetails(
          listing,
          priorityTypes,
          listingUnitsSummary,
          variant,
        );

        const emailButtons = jurisdiction.languages.map((code) => ({
          name: this.polyglot.t(`rentalOpportunity.viewButton.${code}`),
          url: `${jurisdiction.publicUrl}/${code}/listing/${listing.id}/${listing.urlSlug}`,
        }));

        await this.send(
          emails[language],
          jurisdiction.emailFromAddress,
          this.polyglot.t(subjectKey, {
            listingName: listing.name,
          }),
          this.template('listing-opportunity')({
            listingName: listing.name,
            introKey,
            tableRows: listingDetails,
            languageUrls: emailButtons,
            accessibleMarketingFlyerUrl: listing.accessibleMarketingFlyer,
            emailSettingsUrl: `${jurisdiction.publicUrl}/sign-in?redirectUrl=/account/notifications`,
          }),
        );
      }
    } catch (err) {
      this.logger.log('rental opportunity email failed', err);
      throw new HttpException('email failed', 500);
    }
  }

  public async listingPublishNotificationViaGovDelivery(
    jurisdictionId: IdDTO,
    listing: Listing,
    priorityTypes: UnitAccessibilityPriorityTypeEnum[],
    variant: ListingNotificationVariant = 'standard',
  ) {
    try {
      const jurisdiction = await this.getJurisdiction([jurisdictionId]);
      const listingUnitsSummary = summarizeListingUnitsByType(listing.units);
      const subjectKey =
        variant === 'comingSoon'
          ? 'rentalOpportunity.comingSoon.subject'
          : 'rentalOpportunity.subject';
      const introKey =
        variant === 'comingSoon'
          ? 'rentalOpportunity.comingSoon.intro'
          : 'rentalOpportunity.intro';

      void (await this.loadTranslations(jurisdiction, 'en'));

      this.logger.log(
        `Sending lottery published govDelivery email for listing ${listing.name}`,
      );

      const listingDetails = this.buildListingDetails(
        listing,
        priorityTypes,
        listingUnitsSummary,
        variant,
      );

      const emailButtons = jurisdiction.languages.map((code) => ({
        name: this.polyglot.t(`rentalOpportunity.viewButton.${code}`),
        url: `${jurisdiction.publicUrl}/${code}/listing/${listing.id}/${listing.urlSlug}`,
      }));

      const footerLinks = [];
      let hasFooterLinks = true;
      while (hasFooterLinks) {
        if (
          this.polyglot.has(
            `rentalOpportunity.footer.additionalLink${footerLinks.length}.text`,
          )
        ) {
          footerLinks.push({
            text: this.polyglot.t(
              `rentalOpportunity.footer.additionalLink${footerLinks.length}.text`,
            ),
            name: this.polyglot.t(
              `rentalOpportunity.footer.additionalLink${footerLinks.length}.name`,
            ),
            url: this.polyglot.t(
              `rentalOpportunity.footer.additionalLink${footerLinks.length}.url`,
            ),
          });
        } else {
          hasFooterLinks = false;
        }
      }

      await this.govDeliveryService.send({
        to: [],
        from: process.env.GOVDELIVERY_FROM_EMAIL_ID,
        subject: this.polyglot.t(subjectKey, {
          listingName: listing.name,
        }),
        body: this.template('listing-opportunity')({
          listingName: listing.name,
          introKey,
          tableRows: listingDetails,
          languageUrls: emailButtons,
          accessibleMarketingFlyerUrl: listing.accessibleMarketingFlyer,
          disclaimerText: this.polyglot.has('rentalOpportunity.disclaimer')
            ? this.polyglot.t('rentalOpportunity.disclaimer')
            : undefined,
          footerLinks,
        }),
      });
    } catch (err) {
      this.logger.log('govDelivery rental opportunity email failed', err);
      throw new HttpException('email failed', 500);
    }
  }

  formatLocalDate(rawDate: string | Date, format: string): string {
    const utcDate = dayjs.utc(rawDate);
    return utcDate.format(format);
  }
}
