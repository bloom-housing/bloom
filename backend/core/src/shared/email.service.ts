import { Injectable, Logger } from "@nestjs/common"
import { SendGridService } from "@anchan828/nest-sendgrid"
import { ResponseError } from "@sendgrid/helpers/classes"
import Handlebars from "handlebars"
import path from "path"
import { User } from "../entity/user.entity"
import { Listing } from "../entity/listing.entity"
import Polyglot from "node-polyglot"
import fs from "fs"
import { ConfigService } from "@nestjs/config"
import { Application } from "../applications/entities/application.entity"

@Injectable()
export class EmailService {
  polyglot: Polyglot

  constructor(
    private readonly sendGrid: SendGridService,
    private readonly configService: ConfigService
  ) {
    const polyglot = new Polyglot({
      phrases: this.translations(),
    })
    this.polyglot = polyglot

    Handlebars.registerHelper("t", function (
      phrase: string,
      options?: number | Polyglot.InterpolationOptions
    ) {
      return polyglot.t(phrase, options)
    })
    const parts = this.partials()
    Handlebars.registerPartial(parts)
  }

  public async welcome(user: User) {
    if (this.configService.get<string>("NODE_ENV") === "production") {
      Logger.log(
        `Preparing to send a welcome email to ${user.email} from ${this.configService.get<string>(
          "EMAIL_FROM_ADDRESS"
        )}...`
      )
    }
    // TODO set locale for user
    // polyglot.locale(user.lang)
    await this.send(user.email, "Welcome to Bloom", this.template("register-email")({ user: user }))
  }

  public async confirmation(listing: Listing, application: Application, appUrl: string) {
    let whatToExpectText
    const listingUrl = `${appUrl}/listing/${listing.id}`
    const compiledTemplate = this.template("confirmation")

    if (this.configService.get<string>("NODE_ENV") == "production") {
      Logger.log(
        `Preparing to send a confirmation email to ${
          application.applicant.emailAddress
        } from ${this.configService.get<string>("EMAIL_FROM_ADDRESS")}...`
      )
    }

    if (listing.applicationDueDate) {
      if (!listing.waitlistMaxSize) {
        whatToExpectText = this.polyglot.t("confirmation.whatToExpect.lottery", {
          lotteryDate: listing.applicationDueDate,
        })
      } else {
        whatToExpectText = this.polyglot.t("confirmation.whatToExpect.noLottery", {
          lotteryDate: listing.applicationDueDate,
        })
      }
    } else {
      whatToExpectText = this.polyglot.t("confirmation.whatToExpect.FCFS")
    }
    const user = {
      firstName: application.applicant.firstName,
      middleName: application.applicant.middleName,
      lastName: application.applicant.lastName,
    }
    await this.send(
      application.applicant.emailAddress,
      this.polyglot.t("confirmation.subject"),
      compiledTemplate({
        listing: listing,
        listingUrl: listingUrl,
        application: application,
        whatToExpectText: whatToExpectText,
        user: user,
      })
    )
  }

  private template(view: string) {
    return Handlebars.compile(
      fs.readFileSync(path.join(path.resolve(__dirname, "..", "views"), `/${view}.hbs`), "utf8")
    )
  }

  private partial(view: string) {
    return fs.readFileSync(path.join(path.resolve(__dirname, "..", "views"), `/${view}`), "utf8")
  }

  private partials() {
    const partials = {}
    const dirName = path.resolve(__dirname, "..", "views/partials")

    fs.readdirSync(dirName).forEach((filename) => {
      partials[filename.slice(0, -4)] = this.partial("partials/" + filename)
    })

    return partials
  }

  private translations() {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "locals/general.json"), "utf8"))
  }

  private async send(to: string, subject: string, body: string, retry?: number) {
    await this.sendGrid.send(
      {
        to: to,
        from: this.configService.get<string>("EMAIL_FROM_ADDRESS"),
        subject: subject,
        html: body,
      },
      false,
      (error) => {
        if (error instanceof ResponseError) {
          const { response } = error
          const { body } = response
          console.error(`Error sending email to: ${to}! Error body: ${body}`)
          if (!retry) {
            retry = 3
          }
          // Retries, if sending failed
          void this.send(to, subject, body, retry - 1)
        }
      }
    )
  }
}
