import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { newEnforcer } from "casbin"
import path from "path"
import { User } from "../entities/user.entity"
import { Listing } from "../../listings/entities/listing.entity"
import { UserRoleEnum } from "../enum/user-role-enum"
import { authzActions } from "../enum/authz-actions.enum"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"

@Injectable()
export class AuthzService {
  /**
   * Check whether this is an authorized action based on the authz rules.
   * @param user User making the request. If not specified, the request will be authorized against a user with role
   *             "visitor" and id "anonymous"
   * @param type Type of resource to verify access to
   * @param action Action (e.g. "read", "edit", etc.) requested
   * @param obj Optional resource object to check request against. If provided this can be used by the rule to perform
   * ABAC logic. Note that a limitation in casbin seems to only allows for property retrieval one level deep on this
   * object (e.g. obj.prop.value wouldn't work).
   */
  public async can(
    user: User | undefined,
    type: string,
    action: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj?: any
  ): Promise<boolean> {
    const e = await newEnforcer(
      path.join(__dirname, "..", "authz_model.conf"),
      path.join(__dirname, "..", "authz_policy.csv")
    )

    // Get User roles and add them to our enforcer
    if (user) {
      if (user.roles?.isAdmin) {
        await e.addRoleForUser(user.id, UserRoleEnum.admin)
      }
      if (user.roles?.isPartner) {
        await e.addRoleForUser(user.id, UserRoleEnum.partner)
      }
      await e.addRoleForUser(user.id, UserRoleEnum.user)

      // NOTE This normally should be in authz_policy.csv, but casbin does not support expressions on arrays.
      //  Permissions for a leasing agent on applications are there defined here programatically.
      //  A User becomes a leasing agent for a given listing if he has a relation (M:N) with it.
      //  User side this is expressed by 'leasingAgentInListings' property.
      await Promise.all(
        user?.leasingAgentInListings.map((leasingAgentInListing: Listing) => {
          void e.addPermissionForUser(
            user.id,
            "application",
            `r.obj.listingId == '${leasingAgentInListing.id}'`,
            `(${authzActions.read}|${authzActions.create}|${authzActions.update}|${authzActions.delete})`
          )
          void e.addPermissionForUser(
            user.id,
            "listing",
            `r.obj.id == '${leasingAgentInListing.id}'`,
            `(${authzActions.read}|${authzActions.update})`
          )
        })
      )

      if (user.roles?.isJurisdictionalAdmin) {
        await Promise.all(
          user.jurisdictions.map((adminInJurisdiction: Jurisdiction) => {
            void e.addPermissionForUser(
              user.id,
              "application",
              `r.obj.jurisdictionId == '${adminInJurisdiction.id}'`,
              `(${authzActions.read}|${authzActions.create}|${authzActions.update}|${authzActions.delete})`
            )
            void e.addPermissionForUser(
              user.id,
              "listing",
              `r.obj.jurisdictionId == '${adminInJurisdiction.id}'`,
              `(${authzActions.read}|${authzActions.create}|${authzActions.update}|${authzActions.delete})`
            )
            void e.addPermissionForUser(
              user.id,
              "user",
              `r.obj.jurisdictionId == '${adminInJurisdiction.id}'`,
              `(${authzActions.read}|${authzActions.invitePartner}|${authzActions.inviteJurisdictionalAdmin})`
            )
          })
        )
      }
    }

    return await e.enforce(user ? user.id : "anonymous", type, action, obj)
  }

  /**
   * Check whether this is an authorized action based on the authz rules.
   * @param user User making the request. If not specified, the request will be authorized against a user with role
   *             "visitor" and id "anonymous"
   * @param type Type of resource to verify access to
   * @param action Action (e.g. "read", "edit", etc.) requested
   * @param obj Optional resource object to check request against. If provided this can be used by the rule to perform
   * ABAC logic. Note that a limitation in casbin seems to only allows for property retrieval one level deep on this
   * object (e.g. obj.prop.value wouldn't work).
   */
  public async canOrThrow(user: User | undefined, type: string, action: string, obj?: unknown) {
    if (!(await this.can(user, type, action, obj))) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
    }
  }
}
