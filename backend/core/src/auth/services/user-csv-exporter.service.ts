import { Injectable, Scope } from "@nestjs/common"
import dayjs from "dayjs"
import { Pagination } from "nestjs-typeorm-paginate"
import { CsvBuilder } from "../../applications/services/csv-builder.service"
import { User } from "../entities/user.entity"

@Injectable({ scope: Scope.REQUEST })
export class UserCsvExporterService {
  constructor(private readonly csvBuilder: CsvBuilder) {}

  exportFromObject(users: Pagination<User>): string {
    const userObj = users.items.reduce((obj, user) => {
      const roles = []
      if (user.roles?.isAdmin) {
        roles.push("Administrator")
      }
      if (user.roles?.isPartner) {
        roles.push("Partner")
      }
      if (user.roles?.isJurisdictionalAdmin) {
        roles.push("Jurisdictional Admin")
      }
      obj[user.id] = {
        "First Name": user.firstName,
        "Last Name": user.lastName,
        Email: user.email,
        Role: roles.join(", "),
        "Date Created": dayjs(user.createdAt).format("MM-DD-YYYY HH:mmZ[Z]"),
        Status: user.confirmedAt ? "Confirmed" : "Unconfirmed",
        "Listing Names":
          user.leasingAgentInListings?.map((listing) => listing.name).join(", ") || "",
        "Listing Ids": user.leasingAgentInListings?.map((listing) => listing.id).join(", ") || "",
        "Last Logged In": dayjs(user.lastLoginAt).format("MM-DD-YYYY HH:mmZ[Z]"),
      }
      return obj
    }, {})
    return this.csvBuilder.buildFromIdIndex(userObj)
  }
}
