import { Injectable, Logger, Scope } from "@nestjs/common"
import { SendGridService } from "@anchan828/nest-sendgrid"
import { ResponseError } from "@sendgrid/helpers/classes"
import merge from "lodash/merge"
import Handlebars from "handlebars"
import path from "path"
import Polyglot from "node-polyglot"
import fs from "fs"
import { ConfigService } from "@nestjs/config"
import { TranslationsService } from "../translations/services/translations.service"
import { JurisdictionResolverService } from "../jurisdictions/services/jurisdiction-resolver.service"
import { User } from "../auth/entities/user.entity"
import { Listing } from "../listings/entities/listing.entity"
import { Application } from "../applications/entities/application.entity"
import { ListingReviewOrder } from "../listings/types/listing-review-order-enum"
import { Jurisdiction } from "../jurisdictions/entities/jurisdiction.entity"
import { Language } from "../shared/types/language-enum"
import { JurisdictionsService } from "../jurisdictions/services/jurisdictions.service"
import { Translation } from "../translations/entities/translation.entity"
import { IdName } from "../../types"

@Injectable({ scope: Scope.REQUEST })
export class EmailService {
  polyglot: Polyglot

  constructor(
    private readonly sendGrid: SendGridService,
    private readonly configService: ConfigService,
    private readonly translationService: TranslationsService,
    private readonly jurisdictionResolverService: JurisdictionResolverService,
    private readonly jurisdictionService: JurisdictionsService
  ) {
    this.polyglot = new Polyglot({
      phrases: {},
    })
    const polyglot = this.polyglot
    Handlebars.registerHelper("t", function (
      phrase: string,
      options?: number | Polyglot.InterpolationOptions
    ) {
      return polyglot.t(phrase, options)
    })
    const parts = this.partials()
    Handlebars.registerPartial(parts)
  }

  public async welcome(user: User, appUrl: string, confirmationUrl: string) {
    const jurisdiction = await this.getUserJurisdiction(user)
    await this.loadTranslationsForUser(user)
    if (this.configService.get<string>("NODE_ENV") === "production") {
      Logger.log(
        `Preparing to send a welcome email to ${user.email} from ${jurisdiction.emailFromAddress}...`
      )
    }
    await this.send(
      user.email,
      jurisdiction.emailFromAddress,
      this.polyglot.t("register.welcome"),
      this.template("register-email")({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl: appUrl },
      })
    )
  }

  private async getUserJurisdiction(user?: User, existingUser?: User) {
    let jurisdiction = await this.jurisdictionResolverService.getJurisdiction()
    if (!jurisdiction && user?.jurisdictions) {
      let whereClause = { id: user.jurisdictions[0].id }
      if (existingUser?.jurisdictions) {
        // if we are updating an existing user, narrow jurisdictions down to new jurisdictions only
        const newJuris = user.jurisdictions.filter(
          (juris) =>
            !existingUser.jurisdictions.some((preExistingJuris) => preExistingJuris.id === juris.id)
        )
        if (newJuris.length) {
          whereClause = { id: newJuris[0].id }
        }
      }

      jurisdiction = await this.jurisdictionService.findOne({
        where: whereClause,
      })
    }
    return jurisdiction
  }

  private async getListingJurisdiction(listing?: Listing) {
    let jurisdiction = await this.jurisdictionResolverService.getJurisdiction()
    if (!jurisdiction && listing?.jurisdiction) {
      jurisdiction = listing.jurisdiction
    }

    return jurisdiction
  }

  private async loadTranslationsForUser(user: User) {
    const language = user.language || Language.en
    const jurisdiction = await this.getUserJurisdiction(user)
    void (await this.loadTranslations(jurisdiction, language))
  }

  public async changeEmail(user: User, appUrl: string, confirmationUrl: string, newEmail: string) {
    const jurisdiction = await this.getUserJurisdiction(user)
    await this.loadTranslationsForUser(user)
    await this.send(
      newEmail,
      jurisdiction.emailFromAddress,
      "Bloom email change request",
      this.template("change-email")({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl: appUrl },
      })
    )
  }

  public async sendMfaCode(user: User, email: string, mfaCode: string) {
    const jurisdiction = await this.getUserJurisdiction(user)
    await this.loadTranslationsForUser(user)
    await this.send(
      email,
      jurisdiction.emailFromAddress,
      "Partners Portal account access token",
      this.template("mfa-code")({
        user: user,
        mfaCodeOptions: { mfaCode },
      })
    )
  }

  public async confirmation(listing: Listing, application: Application, appUrl: string) {
    const jurisdiction = await this.getListingJurisdiction(listing)
    void (await this.loadTranslations(jurisdiction, application.language || Language.en))
    const listingUrl = `${appUrl}/listing/${listing.id}`
    const compiledTemplate = this.template("confirmation")

    if (this.configService.get<string>("NODE_ENV") == "production") {
      Logger.log(
        `Preparing to send a confirmation email to ${application.applicant.emailAddress} from ${jurisdiction.emailFromAddress}...`
      )
    }

    let eligibleText
    let preferenceText
    let contactText = null
    if (listing.reviewOrderType === ListingReviewOrder.firstComeFirstServe) {
      eligibleText = this.polyglot.t("confirmation.eligible.fcfs")
      preferenceText = this.polyglot.t("confirmation.eligible.fcfsPreference")
    }
    if (listing.reviewOrderType === ListingReviewOrder.lottery) {
      eligibleText = this.polyglot.t("confirmation.eligible.lottery")
      preferenceText = this.polyglot.t("confirmation.eligible.lotteryPreference")
    }
    if (listing.reviewOrderType === ListingReviewOrder.waitlist) {
      eligibleText = this.polyglot.t("confirmation.eligible.waitlist")
      contactText = this.polyglot.t("confirmation.eligible.waitlistContact")
      preferenceText = this.polyglot.t("confirmation.eligible.waitlistPreference")
    }

    const user = {
      firstName: application.applicant.firstName,
      middleName: application.applicant.middleName,
      lastName: application.applicant.lastName,
    }

    const nextStepsUrl = this.polyglot.t("confirmation.nextStepsUrl")

    await this.send(
      application.applicant.emailAddress,
      jurisdiction.emailFromAddress,
      this.polyglot.t("confirmation.subject"),
      compiledTemplate({
        subject: this.polyglot.t("confirmation.subject"),
        header: {
          logoTitle: this.polyglot.t("header.logoTitle"),
          logoUrl: this.polyglot.t("header.logoUrl"),
        },
        listing,
        listingUrl,
        application,
        preferenceText,
        interviewText: this.polyglot.t("confirmation.interview"),
        eligibleText,
        contactText,
        nextStepsUrl: nextStepsUrl != "confirmation.nextStepsUrl" ? nextStepsUrl : null,
        user,
      })
    )
  }

  public async forgotPassword(user: User, appUrl: string) {
    const jurisdiction = await this.getUserJurisdiction(user)
    void (await this.loadTranslations(jurisdiction, user.language))
    const compiledTemplate = this.template("forgot-password")
    const resetUrl = `${appUrl}/reset-password?token=${user.resetToken}`

    if (this.configService.get<string>("NODE_ENV") == "production") {
      Logger.log(
        `Preparing to send a forget password email to ${user.email} from ${jurisdiction.emailFromAddress}...`
      )
    }

    await this.send(
      user.email,
      jurisdiction.emailFromAddress,
      this.polyglot.t("forgotPassword.subject"),
      compiledTemplate({
        resetUrl: resetUrl,
        resetOptions: { appUrl: appUrl },
        user: user,
      })
    )
  }

  private async loadTranslations(jurisdiction: Jurisdiction | null, language: Language) {
    let jurisdictionalTranslations: Translation | null,
      genericTranslations: Translation | null,
      jurisdictionalDefaultTranslations: Translation | null

    if (language && language !== Language.en) {
      if (jurisdiction) {
        jurisdictionalTranslations = await this.translationService.getTranslationByLanguageAndJurisdictionOrDefaultEn(
          language,
          jurisdiction.id
        )
      }
      genericTranslations = await this.translationService.getTranslationByLanguageAndJurisdictionOrDefaultEn(
        language,
        null
      )
    }

    if (jurisdiction) {
      jurisdictionalDefaultTranslations = await this.translationService.getTranslationByLanguageAndJurisdictionOrDefaultEn(
        Language.en,
        jurisdiction.id
      )
    }

    const genericDefaultTranslations = await this.translationService.getTranslationByLanguageAndJurisdictionOrDefaultEn(
      Language.en,
      null
    )

    // Deep merge
    const translations = merge(
      genericDefaultTranslations.translations,
      genericTranslations?.translations,
      jurisdictionalDefaultTranslations?.translations,
      jurisdictionalTranslations?.translations
    )

    this.polyglot.replace(translations)
  }

  private template(view: string) {
    return Handlebars.compile(
      fs.readFileSync(
        path.join(path.resolve(__dirname, "..", "shared", "views"), `/${view}.hbs`),
        "utf8"
      )
    )
  }

  private partial(view: string) {
    return fs.readFileSync(
      path.join(path.resolve(__dirname, "..", "shared", "views"), `/${view}`),
      "utf8"
    )
  }

  private partials() {
    const partials = {}
    const dirName = path.resolve(__dirname, "..", "shared", "views/partials")

    fs.readdirSync(dirName).forEach((filename) => {
      partials[filename.slice(0, -4)] = this.partial("partials/" + filename)
    })

    const layoutsDirName = path.resolve(__dirname, "..", "shared", "views/layouts")

    fs.readdirSync(layoutsDirName).forEach((filename) => {
      partials[`layout_${filename.slice(0, -4)}`] = this.partial("layouts/" + filename)
    })

    return partials
  }

  private async send(
    to: string | string[],
    from: string,
    subject: string,
    body: string,
    retry = 3
  ) {
    const multipleRecipients = Array.isArray(to)
    const emailParams = {
      to: to,
      from: from,
      subject: subject,
      html: body,
    }
    const handleError = (error) => {
      if (error instanceof ResponseError) {
        const { response } = error
        const { body: errBody } = response
        console.error(
          `Error sending email to: ${
            multipleRecipients ? to.toString() : to
          }! Error body: ${errBody}`
        )
        if (retry > 0) {
          void this.send(to, from, subject, body, retry - 1)
        }
      }
    }

    multipleRecipients
      ? await this.sendGrid.sendMultiple(emailParams, handleError)
      : await this.sendGrid.send(emailParams, false, handleError)
  }

  async invite(user: User, appUrl: string, confirmationUrl: string) {
    void (await this.loadTranslations(
      user.jurisdictions?.length === 1 ? user.jurisdictions[0] : null,
      user.language || Language.en
    ))
    const jurisdiction = await this.getUserJurisdiction(user)
    await this.send(
      user.email,
      jurisdiction.emailFromAddress,
      this.polyglot.t("invite.hello"),
      this.template("invite")({
        user: user,
        confirmationUrl: confirmationUrl,
        appOptions: { appUrl },
      })
    )
  }

  async portalAccountUpdate(user: User, appUrl: string, existingUser: User) {
    const jurisdiction = await this.getUserJurisdiction(user, existingUser)
    void (await this.loadTranslations(jurisdiction, user.language || Language.en))
    await this.send(
      user.email,
      jurisdiction.emailFromAddress,
      this.polyglot.t("invite.portalAccountUpdate"),
      this.template("portal-account-update")({
        user,
        appUrl,
      })
    )
  }

  public async requestApproval(user: User, listingInfo: IdName, emails: string[], appUrl: string) {
    const jurisdiction = await this.getUserJurisdiction(user)
    void (await this.loadTranslations(jurisdiction, Language.en))
    await this.send(
      emails,
      jurisdiction.emailFromAddress,
      this.polyglot.t("requestApproval.header"),
      this.template("request-approval")({
        user,
        appOptions: { listingName: listingInfo.name },
        appUrl: appUrl,
        listingUrl: `${appUrl}/listings/${listingInfo.id}`,
      })
    )
  }

  public async listingApproved(
    user: User,
    listingInfo: IdName,
    emails: string[],
    publicUrl: string
  ) {
    const jurisdiction = await this.getUserJurisdiction(user)
    void (await this.loadTranslations(jurisdiction, Language.en))
    await this.send(
      emails,
      jurisdiction.emailFromAddress,
      this.polyglot.t("listingApproved.header"),
      this.template("listing-approved")({
        user,
        appOptions: { listingName: listingInfo.name },
        listingUrl: `${publicUrl}/listings/${listingInfo.id}`,
      })
    )
  }
}
