import { SendGridService } from '@anchan828/nest-sendgrid';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseError } from '@sendgrid/helpers/classes';
import fs from 'fs';
import Handlebars from 'handlebars';
import Polyglot from 'node-polyglot';
import path from 'path';
import { TranslationService } from './translation.service';
import { JurisdictionService } from './jurisdiction.service';
import { Jurisdiction } from '../dtos/jurisdictions/jurisdiction.dto';
import { LanguagesEnum, Translations } from '@prisma/client';
import { IdDTO } from '../dtos/shared/id.dto';

type User = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  language: LanguagesEnum;
};
@Injectable()
export class EmailService {
  polyglot: Polyglot;

  constructor(
    private readonly sendGrid: SendGridService,
    private readonly configService: ConfigService,
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
    to: string,
    from: string,
    subject: string,
    body: string,
    retry = 3,
  ) {
    await this.sendGrid.send(
      {
        to: to,
        from,
        subject: subject,
        html: body,
      },
      false,
      (error) => {
        if (error instanceof ResponseError) {
          const { response } = error;
          const { body: errBody } = response;
          console.error(
            `Error sending email to: ${to}! Error body: ${errBody}`,
          );
          if (retry > 0) {
            void this.send(to, from, subject, body, retry - 1);
          }
        }
      },
    );
  }

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

  private async getUserJurisdiction(
    jurisdictionIds: IdDTO[] | null,
  ): Promise<Jurisdiction | null> {
    // TODO: figure out multiple jurisdictions
    if (jurisdictionIds?.length === 1) {
      return await this.jurisdictionService.findOne({
        jurisdictionId: jurisdictionIds[0]?.id,
      });
    }
    return null;
  }

  public async welcome(
    jurisdictionIds: IdDTO[],
    user: User,
    appUrl: string,
    confirmationUrl: string,
  ) {
    const jurisdiction = await this.getUserJurisdiction(jurisdictionIds);
    await this.loadTranslations(jurisdiction, user.language);
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      Logger.log(
        `Preparing to send a welcome email to ${user.email} from ${jurisdiction.emailFromAddress}...`,
      );
    }
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

  async invitePartnerUser(
    jurisdictionIds: IdDTO[],
    user: User,
    appUrl: string,
    confirmationUrl: string,
  ) {
    const jurisdiction = await this.getUserJurisdiction(jurisdictionIds);
    void (await this.loadTranslations(
      jurisdiction,
      user.language || LanguagesEnum.en,
    ));
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

  async portalAccountUpdate(
    jurisdictionIds: IdDTO[],
    user: User,
    appUrl: string,
  ) {
    const jurisdiction = await this.getUserJurisdiction(jurisdictionIds);
    void (await this.loadTranslations(
      jurisdiction,
      user.language || LanguagesEnum.en,
    ));
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

  public async changeEmail(
    jurisdictionIds: IdDTO[],
    user: User,
    appUrl: string,
    confirmationUrl: string,
    newEmail: string,
  ) {
    const jurisdiction = await this.getUserJurisdiction(jurisdictionIds);
    await this.loadTranslations(
      jurisdiction,
      user.language || LanguagesEnum.en,
    );
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

  public async forgotPassword(
    jurisdictionIds: IdDTO[],
    user: User,
    appUrl: string,
    resetToken: string,
  ) {
    const jurisdiction = await this.getUserJurisdiction(jurisdictionIds);
    console.log(jurisdiction);
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
    const jurisdiction = await this.getUserJurisdiction(jurisdictionIds);
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
}
