import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseError } from '@sendgrid/helpers/classes';
import fs from 'fs';
import Handlebars from 'handlebars';
import Polyglot from 'node-polyglot';
import path from 'path';
import { TranslationService } from './translation.service';
import { JurisdictionService } from './jurisdiction.service';
import { Jurisdiction } from '../dtos/jurisdictions/jurisdiction.dto';
import { LanguagesEnum, ReviewOrderTypeEnum } from '@prisma/client';
import { IdDTO } from '../dtos/shared/id.dto';
import { Listing } from '../dtos/listings/listing.dto';
import { Application } from '../dtos/applications/application.dto';
import { SendGridService } from './sendgrid.service';

type User = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  language: LanguagesEnum;
};
@Injectable()
export class EmailService {
  polyglot: Polyglot;

  constructor(
    private readonly sendGrid: SendGridService,
    private readonly translationService: TranslationService,
    private readonly jurisdictionService: JurisdictionService,
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
  ) {
    const isMultipleRecipients = Array.isArray(to);
    const emailParams = {
      to,
      from,
      subject,
      html: body,
    };
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
  ): Promise<Jurisdiction | null> {
    // Only return the jurisdiction if there is one jurisdiction passed in.
    // For example if the user is tied to more than one jurisdiction the user should received the generic translations
    if (jurisdictionIds?.length === 1) {
      return await this.jurisdictionService.findOne({
        jurisdictionId: jurisdictionIds[0]?.id,
      });
    }
    return null;
  }

  /* Send welcome email to new public users */
  public async welcome(
    jurisdictionIds: IdDTO[],
    user: User,
    appUrl: string,
    confirmationUrl: string,
  ) {
    const jurisdiction = await this.getJurisdiction(jurisdictionIds);
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
    await this.send(
      user.email,
      jurisdiction.emailFromAddress,
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
    await this.send(
      user.email,
      jurisdiction.emailFromAddress,
      this.polyglot.t('invite.portalAccountUpdate'),
      this.template('portal-account-update')({
        user,
        appUrl,
      }),
    );
  }

  /* send change of email email */
  public async changeEmail(
    jurisdictionIds: IdDTO[],
    user: User,
    appUrl: string,
    confirmationUrl: string,
    newEmail: string,
  ) {
    const jurisdiction = await this.getJurisdiction(jurisdictionIds);
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

    await this.send(
      user.email,
      jurisdiction.emailFromAddress,
      this.polyglot.t('forgotPassword.subject'),
      compiledTemplate({
        resetUrl: resetUrl,
        resetOptions: { appUrl: appUrl },
        user: user,
      }),
    );
  }

  // TODO: connect to auth controller when it is implemented
  public async sendMfaCode(
    jurisdictionIds: IdDTO[],
    user: User,
    email: string,
    mfaCode: string,
  ) {
    const jurisdiction = await this.getJurisdiction(jurisdictionIds);
    void (await this.loadTranslations(jurisdiction, user.language));
    await this.send(
      email,
      jurisdiction.emailFromAddress,
      'Partners Portal account access token',
      this.template('mfa-code')({
        user: user,
        mfaCodeOptions: { mfaCode },
      }),
    );
  }

  // TODO: connect to application controller when it is implemented
  public async applicationConfirmation(
    listing: Listing,
    application: Application,
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
      throw new HttpException('email failed', 500);
    }
  }

  public async changesRequested(
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
        this.polyglot.t('changesRequested.header'),
        this.template('changes-requested')({
          appOptions: { listingName: listingInfo.name },
          appUrl: appUrl,
          listingUrl: `${appUrl}/listings/${listingInfo.id}`,
        }),
      );
    } catch (err) {
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
      throw new HttpException('email failed', 500);
    }
  }
}
