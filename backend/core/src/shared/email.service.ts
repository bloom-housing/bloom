import { ApplicationCreateDto } from "./../applications/application.create.dto"
import { Injectable, Logger } from "@nestjs/common"
import { SendGridService } from "@anchan828/nest-sendgrid"
import { ResponseError } from "@sendgrid/helpers/classes"
import Handlebars from "handlebars"
import path from "path"
import { User } from "../entity/user.entity"
import { Listing } from "../entity/listing.entity"
import Polyglot from "node-polyglot"
import fs from "fs"

@Injectable()
export class EmailService {
  polyglot: Polyglot

  constructor(private readonly sendGrid: SendGridService) {
    const polyglot = new Polyglot({
      phrases: this.translations(),
    })
    this.polyglot = polyglot

    Handlebars.registerHelper("t", function (phrase: string, options?: any) {
      return polyglot.t(phrase, options)
    })
    const parts = this.partials()
    Handlebars.registerPartial(parts)
  }

  public async welcome(user: User) {
    if (process.env.NODE_ENV == "production") {
      Logger.log(
        `Preparing to send a welcome email to ${user.email} from ${process.env.EMAIL_FROM_ADDRESS}...`
      )
    }
    // TODO set locale for user
    // polyglot.locale(user.lang)
    await this.send(user.email, "Welcome to Bloom", this.template("register-email")({ user: user }))
  }

  public async confirmation(listing: Listing, application: any, appUrl: string) {
    let whatToExpectText
    const appData = application.application
    const listingUrl = `${appUrl}/listing/${listing.id}`
    const compiledTemplate = this.template("confirmation")

    if (process.env.NODE_ENV == "production") {
      Logger.log(
        `Preparing to send a confirmation email to ${appData.applicant.emailAddress} from ${process.env.EMAIL_FROM_ADDRESS}...`
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
      firstName: appData.applicant.firstName,
      middleName: appData.applicant.middleName,
      lastName: appData.applicant.lastName,
    }
    await this.send(
      appData.applicant.emailAddress,
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
        from: process.env.EMAIL_FROM_ADDRESS,
        subject: subject,
        html: body,
      },
      false,
      (error, info) => {
        if (error instanceof ResponseError) {
          const { message, code, response } = error
          const { headers, body } = response
          console.error(`Error sending email to: ${to}! Error body: ${body}`)
          if (!retry) {
            retry = 3
          }
          // Retries, if sending failed
          this.send(to, subject, body, retry - 1)
        }
      }
    )
  }
}
