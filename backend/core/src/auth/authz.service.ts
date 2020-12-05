import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { newEnforcer } from "casbin"
import path from "path"
import { User } from "../.."

export enum authzActions {
  create = "create",
  read = "read",
  update = "update",
  delete = "delete",
  listAll = "list_all",
  submit = "submit",
}

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
      path.join(__dirname, "authz_model.conf"),
      path.join(__dirname, "authz_policy.csv")
    )

    // Get User roles and add them to our enforcer
    if (user) {
      await Promise.all(user.roles.map((r) => e.addRoleForUser(user.id, r)))
    }
    return e.enforce(user ? user.id : "anonymous", type, action, obj)
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
  public async canOrThrow(user: User | undefined, type: string, action: string, obj?: any) {
    if (!(await this.can(user, type, action, obj))) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
    }
  }
}
