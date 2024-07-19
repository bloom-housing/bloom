import { Injectable, ForbiddenException } from '@nestjs/common';
import { Enforcer, newEnforcer } from 'casbin';
import path from 'path';
import { UserRoleEnum } from '../enums/permissions/user-role-enum';
import { User } from '../dtos/users/user.dto';
import { PrismaService } from './prisma.service';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { Jurisdiction } from '../dtos/jurisdictions/jurisdiction.dto';
import Listing from '../dtos/listings/listing.dto';

export type permissionCheckingObj = {
  jurisdictionId?: string;
  id?: string;
  listingId?: string;
  userId?: string;
};

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  /**
    Check whether this is an authorized action based on the permission rules.
    @param user User making the request. If not specified, the request will be authorized against a user with role
    "visitor" and id "anonymous"
    @param type Type of resource to verify access to
    @param action Action (e.g. "read", "edit", etc.) requested
    @param obj Optional resource object to check request against. If provided this can be used by the rule to perform
    ABAC logic. Note that a limitation in casbin seems to only allows for property retrieval one level deep on this
    object (e.g. obj.prop.value wouldn't work).
  */
  async can(
    user: User | undefined,
    type: string,
    action: string,
    obj?: permissionCheckingObj,
  ): Promise<boolean> {
    let e = await newEnforcer(
      path.join(__dirname, '../permission-configs', 'permission_model.conf'),
      path.join(__dirname, '../permission-configs', 'permission_policy.csv'),
    );

    if (user) {
      e = await this.addUserPermissions(e, user);

      if (type === 'user' && obj?.id) {
        const accessedUser = await this.prisma.userAccounts.findUnique({
          select: {
            id: true,
            jurisdictions: {
              where: {
                id: {
                  in: user.jurisdictions.map((juris) => juris.id),
                },
              },
            },
            listings: true,
            userRoles: true,
          },
          where: {
            id: obj.id,
          },
        });
        obj.jurisdictionId =
          accessedUser?.jurisdictions.map(
            (jurisdiction) => jurisdiction.id,
          )[0] || '';
      }
    }
    return await e.enforce(user ? user.id : 'anonymous', type, action, obj);
  }

  /**
    adds permissions for users
    Casbin doesn't support our permissioning requirements for jurisdictionalAdmin or partners so we custom build the permission set here
  */
  async addUserPermissions(enforcer: Enforcer, user: User): Promise<Enforcer> {
    await enforcer.addRoleForUser(user.id, UserRoleEnum.user);

    if (user.userRoles?.isAdmin) {
      await enforcer.addRoleForUser(user.id, UserRoleEnum.admin);
    } else if (user.userRoles?.isJurisdictionalAdmin) {
      await enforcer.addRoleForUser(user.id, UserRoleEnum.jurisdictionAdmin);

      await Promise.all(
        user.jurisdictions.map(async (adminInJurisdiction: Jurisdiction) => {
          await enforcer.addPermissionForUser(
            user.id,
            'application',
            `r.obj.jurisdictionId == '${adminInJurisdiction.id}'`,
            `(${permissionActions.read}|${permissionActions.create}|${permissionActions.update}|${permissionActions.delete})`,
          );
          await enforcer.addPermissionForUser(
            user.id,
            'listing',
            `r.obj.jurisdictionId == '${adminInJurisdiction.id}'`,
            `(${permissionActions.read}|${permissionActions.create}|${permissionActions.update}|${permissionActions.delete})`,
          );
          await enforcer.addPermissionForUser(
            user.id,
            'user',
            `r.obj.jurisdictionId == '${adminInJurisdiction.id}'`,
            `(${permissionActions.read})`,
          );
        }),
      );
    } else if (user.userRoles?.isLimitedJurisdictionalAdmin) {
      await enforcer.addRoleForUser(
        user.id,
        UserRoleEnum.limitedJurisdictionAdmin,
      );

      await Promise.all(
        user.jurisdictions.map(async (adminInJurisdiction: Jurisdiction) => {
          await enforcer.addPermissionForUser(
            user.id,
            'listing',
            `r.obj.jurisdictionId == '${adminInJurisdiction.id}'`,
            `(${permissionActions.read}|${permissionActions.create}|${permissionActions.update}|${permissionActions.delete})`,
          );
        }),
      );
    } else if (user.userRoles?.isPartner) {
      await enforcer.addRoleForUser(user.id, UserRoleEnum.partner);

      await Promise.all(
        user?.listings.map(async (listing: Listing) => {
          await enforcer.addPermissionForUser(
            user.id,
            'application',
            `r.obj.listingId == '${listing.id}'`,
            `(${permissionActions.read}|${permissionActions.create}|${permissionActions.update}|${permissionActions.delete})`,
          );
          await enforcer.addPermissionForUser(
            user.id,
            'listing',
            `r.obj.id == '${listing.id}'`,
            `(${permissionActions.read}|${permissionActions.update})`,
          );
        }),
      );
    }
    return enforcer;
  }

  /**
    if the user does not have permissions to perform the request
    then an error is thrown
  */
  async canOrThrow(
    user: User | undefined,
    type: string,
    action: string,
    obj?: permissionCheckingObj,
  ): Promise<void> {
    if (!(await this.can(user, type, action, obj))) {
      throw new ForbiddenException();
    }
  }
}
