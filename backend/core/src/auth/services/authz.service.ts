import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Enforcer, newEnforcer } from "casbin"
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
    let e = await newEnforcer(
      path.join(__dirname, "..", "authz_model.conf"),
      path.join(__dirname, "..", "authz_policy.csv")
    )

    if (user) {
      e = await this.addUserPermissions(e, user)
    }

    return await e.enforce(user ? user.id : "anonymous", type, action, obj)
  }

  private async addUserPermissions(enforcer: Enforcer, user: User): Promise<Enforcer> {
    await enforcer.addRoleForUser(user.id, UserRoleEnum.user)

    if (user.roles?.isAdmin) {
      await enforcer.addRoleForUser(user.id, UserRoleEnum.admin)
      return enforcer
    }

    if (user.roles?.isJurisdictionalAdmin) {
      await Promise.all(
        user.jurisdictions.map((adminInJurisdiction: Jurisdiction) => {
          void enforcer.addPermissionForUser(
            user.id,
            "application",
            `r.obj.jurisdictionId == '${adminInJurisdiction.id}'`,
            `(${authzActions.read}|${authzActions.create}|${authzActions.update}|${authzActions.delete})`
          )
          void enforcer.addPermissionForUser(
            user.id,
            "listing",
            `r.obj.jurisdictionId == '${adminInJurisdiction.id}'`,
            `(${authzActions.read}|${authzActions.create}|${authzActions.update}|${authzActions.delete})`
          )
          void enforcer.addPermissionForUser(
            user.id,
            "user",
            `'${adminInJurisdiction.id}' == '${adminInJurisdiction.id}'`,
            `(${authzActions.read}|${authzActions.invitePartner}|${authzActions.inviteJurisdictionalAdmin})`
          )
        })
      )
      return enforcer
    }

    // NOTE This normally should be in authz_policy.csv, but casbin does not support expressions on arrays.
    //  Permissions for a leasing agent on applications are there defined here programatically.
    //  A User becomes a leasing agent for a given listing if he has a relation (M:N) with it.
    //  User side this is expressed by 'leasingAgentInListings' property.
    if (user.roles?.isPartner) {
      await enforcer.addRoleForUser(user.id, UserRoleEnum.partner)

      await Promise.all(
        user?.leasingAgentInListings.map((leasingAgentInListing: Listing) => {
          void enforcer.addPermissionForUser(
            user.id,
            "application",
            `r.obj.listingId == '${leasingAgentInListing.id}'`,
            `(${authzActions.read}|${authzActions.create}|${authzActions.update}|${authzActions.delete})`
          )
          void enforcer.addPermissionForUser(
            user.id,
            "listing",
            `r.obj.id == '${leasingAgentInListing.id}'`,
            `(${authzActions.read}|${authzActions.update})`
          )
        })
      )
    }
    return enforcer
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
