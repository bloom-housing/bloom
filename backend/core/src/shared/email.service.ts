import { Injectable, Logger } from "@nestjs/common"
import { SendGridService } from "@anchan828/nest-sendgrid"
import { ResponseError } from "@sendgrid/helpers/classes"
import Handlebars from "handlebars"
import path from "path"
import { User } from "../entity/user.entity"
import Polyglot from "node-polyglot"
import fs from "fs"

@Injectable()
export class EmailService {
  polyglot: Polyglot

  constructor(private readonly sendGrid: SendGridService) {
    const polyglot = new Polyglot({
      // TODO Add translations loaded from a file
      phrases: { register: { welcome: "Welcome" } },
    })
    this.polyglot = polyglot

    Handlebars.registerHelper("t", function (phrase: string, options?: any) {
      return polyglot.t(phrase, options)
    })
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

  private template(view: string) {
    return Handlebars.compile(
      fs.readFileSync(
        path.join(
          path.resolve(__dirname, "..", "..", "views").replace("/dist", ""),
          `/${view}.hbs`
        ),
        "utf8"
      )
    )
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
