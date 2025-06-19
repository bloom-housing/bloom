import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ResponseError } from '@sendgrid/helpers/classes';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import fs from 'fs';
import Handlebars from 'handlebars';
import Polyglot from 'node-polyglot';
import path from 'path';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import { TranslationService } from './translation.service';
import { JurisdictionService } from './jurisdiction.service';
import { Jurisdiction } from '../dtos/jurisdictions/jurisdiction.dto';
import { LanguagesEnum, ReviewOrderTypeEnum } from '@prisma/client';
import { IdDTO } from '../dtos/shared/id.dto';
import { Listing } from '../dtos/listings/listing.dto';
import { SendGridService } from './sendgrid.service';
import { ApplicationCreate } from '../dtos/applications/application-create.dto';
import { User } from '../dtos/users/user.dto';
import { getPublicEmailURL } from '../utilities/get-public-email-url';
import { Application } from '../dtos/applications/application.dto';
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
    private readonly translationService: TranslationService,
    private readonly jurisdictionService: JurisdictionService,
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
    retry = 3,
    attachment?: EmailAttachmentData,
  ) {
    const isMultipleRecipients = Array.isArray(to);
    if (isMultipleRecipients && to.length === 0) return;
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
          }! Error body:`,
          errBody,
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
      this.logger.log(
        `Sending request approval email for listing ${listingInfo.name} to ${emails.length} emails`,
      );
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
      this.logger.log(
        `Sending listing approved email for listing ${listingInfo.name} to ${emails.length} emails`,
      );
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
      console.log('lottery released email failed', err);
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
      console.log('lottery published admin email failed', err);
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
        void (await this.loadTranslations(null, language as LanguagesEnum));
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
      console.log('lottery published applicant email failed', err);
      throw new HttpException('email failed', 500);
    }
  }

  formatLocalDate(rawDate: string | Date, format: string): string {
    const utcDate = dayjs.utc(rawDate);
    return utcDate.format(format);
  }
}
