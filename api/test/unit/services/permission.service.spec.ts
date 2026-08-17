import { Test, TestingModule } from '@nestjs/testing';
import { newEnforcer } from 'casbin';
import path from 'path';
import { ListingsStatusEnum } from '@prisma/client';
import { UserRoleEnum } from '../../../src/enums/permissions/user-role-enum';
import { User } from '../../../src/dtos/users/user.dto';
import { PermissionService } from '../../../src/services/permission.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { permissionActions } from '../../../src/enums/permissions/permission-actions-enum';
import { FeatureFlagEnum } from '../../../src/enums/feature-flags/feature-flags-enum';

describe('Testing permission service', () => {
  let service: PermissionService;
  let prisma: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionService, PrismaService],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should add admin user role for user', async () => {
    const e = await newEnforcer(
      path.join(
        __dirname,
        '../../../src/permission-configs',
        'permission_model.conf',
      ),
      path.join(
        __dirname,
        '../../../src/permission-configs',
        'permission_policy.csv',
      ),
    );

    const user = {
      id: 'example id',
      userRoles: {
        isAdmin: true,
      },
    } as User;

    const perms = await service.addUserPermissions(e, user);
    expect(
      await perms.hasRoleForUser('example id', UserRoleEnum.admin),
    ).toEqual(true);
  });

  it('should add jurisdictional admin user role for user when enableOnlyAdminCanManageUsers is false', async () => {
    const e = await newEnforcer(
      path.join(
        __dirname,
        '../../../src/permission-configs',
        'permission_model.conf',
      ),
      path.join(
        __dirname,
        '../../../src/permission-configs',
        'permission_policy.csv',
      ),
    );

    const user = {
      id: 'example id',
      userRoles: {
        isJurisdictionalAdmin: true,
      },
      jurisdictions: [
        {
          id: 'juris id',
        },
      ],
    } as User;

    const enforcer = await service.addUserPermissions(e, user);
    expect(
      await enforcer.hasRoleForUser(
        'example id',
        UserRoleEnum.jurisdictionAdmin,
      ),
    ).toEqual(true);

    expect(
      await enforcer.hasPermissionForUser(
        'example id',
        'application',
        `r.obj.jurisdictionId == 'juris id'`,
        `(${permissionActions.read}|${permissionActions.create}|${permissionActions.update}|${permissionActions.delete})`,
      ),
    ).toEqual(true);

    expect(
      await enforcer.hasPermissionForUser(
        'example id',
        'listing',
        `r.obj.jurisdictionId == 'juris id'`,
        `(${permissionActions.read}|${permissionActions.create}|${permissionActions.update}|${permissionActions.delete})`,
      ),
    ).toEqual(true);

    expect(
      await enforcer.hasPermissionForUser(
        'example id',
        'user',
        `r.obj.jurisdictionId == 'juris id'`,
        `(${permissionActions.read}|${permissionActions.invite}|${permissionActions.update}|${permissionActions.delete})`,
      ),
    ).toEqual(true);
  });

  it('should add jurisdictional admin user role for user when enableOnlyAdminCanManageUsers is true', async () => {
    const e = await newEnforcer(
      path.join(
        __dirname,
        '../../../src/permission-configs',
        'permission_model.conf',
      ),
      path.join(
        __dirname,
        '../../../src/permission-configs',
        'permission_policy.csv',
      ),
    );

    const user = {
      id: 'example id',
      userRoles: {
        isJurisdictionalAdmin: true,
      },
      jurisdictions: [
        {
          id: 'juris id',
          featureFlags: [
            {
              name: FeatureFlagEnum.enableOnlyAdminCanManageUsers,
              active: true,
            },
          ],
        },
      ],
    } as User;

    const enforcer = await service.addUserPermissions(e, user);
    expect(
      await enforcer.hasRoleForUser(
        'example id',
        UserRoleEnum.jurisdictionAdmin,
      ),
    ).toEqual(true);

    expect(
      await enforcer.hasPermissionForUser(
        'example id',
        'application',
        `r.obj.jurisdictionId == 'juris id'`,
        `(${permissionActions.read}|${permissionActions.create}|${permissionActions.update}|${permissionActions.delete})`,
      ),
    ).toEqual(true);

    expect(
      await enforcer.hasPermissionForUser(
        'example id',
        'listing',
        `r.obj.jurisdictionId == 'juris id'`,
        `(${permissionActions.read}|${permissionActions.create}|${permissionActions.update}|${permissionActions.delete})`,
      ),
    ).toEqual(true);

    expect(
      await enforcer.hasPermissionForUser(
        'example id',
        'user',
        `r.obj.jurisdictionId == 'juris id'`,
        `(${permissionActions.read})`,
      ),
    ).toEqual(true);
  });

  it('should add support admin user role for user', async () => {
    const e = await newEnforcer(
      path.join(
        __dirname,
        '../../../src/permission-configs',
        'permission_model.conf',
      ),
      path.join(
        __dirname,
        '../../../src/permission-configs',
        'permission_policy.csv',
      ),
    );

    const user = {
      id: 'example id',
      userRoles: {
        isSupportAdmin: true,
      },
      jurisdictions: [
        {
          id: 'juris id',
        },
      ],
    } as User;

    const enforcer = await service.addUserPermissions(e, user);
    expect(
      await enforcer.hasRoleForUser('example id', UserRoleEnum.supportAdmin),
    ).toEqual(true);
  });

  it('should add partner user role for user', async () => {
    const e = await newEnforcer(
      path.join(
        __dirname,
        '../../../src/permission-configs',
        'permission_model.conf',
      ),
      path.join(
        __dirname,
        '../../../src/permission-configs',
        'permission_policy.csv',
      ),
    );

    const user = {
      id: 'example id',
      userRoles: {
        isPartner: true,
      },
      listings: [
        {
          id: 'listing id 1',
        },
        {
          id: 'listing id 2',
        },
      ],
    } as User;

    prisma.listings.findMany = jest.fn().mockResolvedValue([]);

    const enforcer = await service.addUserPermissions(e, user);
    expect(
      await enforcer.hasRoleForUser('example id', UserRoleEnum.partner),
    ).toEqual(true);

    expect(
      await enforcer.hasPermissionForUser(
        'example id',
        'application',
        `r.obj.listingId == 'listing id 1'`,
        `(${permissionActions.read}|${permissionActions.create}|${permissionActions.update}|${permissionActions.delete})`,
      ),
    ).toEqual(true);

    expect(
      await enforcer.hasPermissionForUser(
        'example id',
        'listing',
        `r.obj.id == 'listing id 1'`,
        `(${permissionActions.read}|${permissionActions.update})`,
      ),
    ).toEqual(true);

    expect(
      await enforcer.hasPermissionForUser(
        'example id',
        'application',
        `r.obj.listingId == 'listing id 2'`,
        `(${permissionActions.read}|${permissionActions.create}|${permissionActions.update}|${permissionActions.delete})`,
      ),
    ).toEqual(true);

    expect(
      await enforcer.hasPermissionForUser(
        'example id',
        'listing',
        `r.obj.id == 'listing id 2'`,
        `(${permissionActions.read}|${permissionActions.update})`,
      ),
    ).toEqual(true);
  });

  it('should allow admin to write users', async () => {
    const user = {
      id: 'example id',
      userRoles: {
        isAdmin: true,
      },
      jurisdictions: [],
      listings: [],
    } as User;

    expect(await service.can(user, 'user', permissionActions.update)).toEqual(
      true,
    );
  });

  it('should allow jurisdictional admin to write listing in the correct jurisdiction', async () => {
    const user = {
      id: 'example id',
      userRoles: {
        isJurisdictionalAdmin: true,
      },
      jurisdictions: [
        {
          id: 'juris id',
        },
      ],
      listings: [],
    } as User;

    expect(
      await service.can(user, 'listing', permissionActions.update, {
        jurisdictionId: 'juris id',
      }),
    ).toEqual(true);
  });

  it('should disallow jurisdictional admin to write listing in an incorrect jurisdiction', async () => {
    const user = {
      id: 'example id',
      userRoles: {
        isJurisdictionalAdmin: true,
      },
      jurisdictions: [
        {
          id: 'juris id',
        },
      ],
      listings: [],
    } as User;

    expect(
      await service.can(user, 'listing', permissionActions.update, {
        jurisdictionId: 'juris id 2',
      }),
    ).toEqual(false);
  });

  it('should allow partner to create application in the correct listing', async () => {
    const user = {
      id: 'example id',
      userRoles: {
        isPartner: true,
      },
      jurisdictions: [],
      listings: [
        {
          id: 'listing id 1',
        },
        {
          id: 'listing id 2',
        },
      ],
    } as User;

    prisma.listings.findMany = jest.fn().mockResolvedValue([]);

    expect(
      await service.can(user, 'application', permissionActions.create, {
        listingId: 'listing id 2',
      }),
    ).toEqual(true);
  });

  it('should disallow partner from creating application in an incorrect listing', async () => {
    const user = {
      id: 'example id',
      userRoles: {
        isPartner: true,
      },
      jurisdictions: [],
      listings: [
        {
          id: 'listing id 1',
        },
        {
          id: 'listing id 2',
        },
      ],
    } as User;

    prisma.listings.findMany = jest.fn().mockResolvedValue([]);

    expect(
      await service.can(user, 'application', permissionActions.create, {
        listingId: 'listing id 3',
      }),
    ).toEqual(false);
  });

  it('should disallow partner from updating open or closed listing when restriction flag is enabled', async () => {
    const user = {
      id: 'example id',
      userRoles: {
        isPartner: true,
      },
      jurisdictions: [],
      listings: [
        {
          id: 'listing id 1',
        },
      ],
    } as User;

    prisma.listings.findMany = jest
      .fn()
      .mockResolvedValue([{ id: 'listing id 1' }]);

    expect(
      await service.can(user, 'listing', permissionActions.update, {
        id: 'listing id 1',
      }),
    ).toEqual(false);

    expect(prisma.listings.findMany).toHaveBeenCalledWith({
      select: { id: true },
      where: {
        id: { in: ['listing id 1'] },
        status: { in: [ListingsStatusEnum.active, ListingsStatusEnum.closed] },
        jurisdictions: {
          featureFlags: {
            some: {
              name: FeatureFlagEnum.disablePartnerPublicListingEdits,
              active: true,
            },
          },
        },
      },
    });
  });

  it('should allow partner to update open listing when restriction flag is disabled', async () => {
    const user = {
      id: 'example id',
      userRoles: {
        isPartner: true,
      },
      jurisdictions: [],
      listings: [
        {
          id: 'listing id 1',
        },
      ],
    } as User;

    prisma.listings.findMany = jest.fn().mockResolvedValue([]);

    expect(
      await service.can(user, 'listing', permissionActions.update, {
        id: 'listing id 1',
      }),
    ).toEqual(true);
  });

  it('should allow jurisdictional admin to read user in the correct jurisdiction', async () => {
    const user = {
      id: 'example id',
      userRoles: {
        isJurisdictionalAdmin: true,
      },
      jurisdictions: [
        {
          id: 'juris id',
        },
      ],
      listings: [],
    } as User;

    prisma.userAccounts.findUnique = jest.fn().mockResolvedValue({
      id: 'obj id',
      jurisdictions: [
        {
          id: 'juris id',
        },
      ],
    });

    expect(
      await service.can(user, 'user', permissionActions.read, {
        id: 'obj id',
      }),
    ).toEqual(true);

    expect(prisma.userAccounts.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'obj id',
      },
      select: {
        id: true,
        listings: true,
        jurisdictions: {
          where: {
            id: {
              in: ['juris id'],
            },
          },
        },
        userRoles: true,
      },
    });
  });

  it('should add limited jurisdiction admin user role for user', async () => {
    const e = await newEnforcer(
      path.join(
        __dirname,
        '../../../src/permission-configs',
        'permission_model.conf',
      ),
      path.join(
        __dirname,
        '../../../src/permission-configs',
        'permission_policy.csv',
      ),
    );

    const user = {
      id: 'example id',
      userRoles: {
        isLimitedJurisdictionalAdmin: true,
      },
      jurisdictions: [
        {
          id: 'juris id',
        },
      ],
    } as User;
    const enforcer = await service.addUserPermissions(e, user);
    expect(
      await enforcer.hasRoleForUser(
        'example id',
        UserRoleEnum.limitedJurisdictionAdmin,
      ),
    ).toEqual(true);
    expect(
      await enforcer.hasPermissionForUser(
        'example id',
        'listing',
        `r.obj.jurisdictionId == 'juris id'`,
        `(${permissionActions.read}|${permissionActions.create}|${permissionActions.update}|${permissionActions.delete})`,
      ),
    ).toEqual(true);
  });

  // Editing both resources is limited to the admin role. Each check names the user's own
  // jurisdiction: no policy consults `r.obj` today, but that is the request a per-user object rule
  // would wrongly allow if one were added. Only the actions each resource exposes are listed.
  const contentPermissions: [string, permissionActions][] = [
    ['translation', permissionActions.read],
    ['translation', permissionActions.update],
    ['translation', permissionActions.delete],
    ['jurisdictionContent', permissionActions.read],
    ['jurisdictionContent', permissionActions.update],
  ];

  // Labelled per permission so a failure names the combination and reports all of them.
  const contentAccessFor = async (user?: User) =>
    Promise.all(
      contentPermissions.map(
        async ([type, action]) =>
          `${type}.${action}=${await service.can(user, type, action, {
            jurisdictionId: 'juris id',
          })}`,
      ),
    );

  // The global Partners translation scope resolves no jurisdiction, so it reaches the policy with
  // an undefined id. Jurisdiction content has no global scope and is left out.
  const globalTranslationAccessFor = async (user?: User) =>
    Promise.all(
      contentPermissions
        .filter(([type]) => type === 'translation')
        .map(
          async ([type, action]) =>
            `${type}.${action}=${await service.can(user, type, action, {
              jurisdictionId: undefined,
            })}`,
        ),
    );

  const rolesBelowAdmin = [
    {
      role: 'a jurisdictional admin',
      user: {
        id: 'juris admin id',
        userRoles: { isJurisdictionalAdmin: true },
        jurisdictions: [{ id: 'juris id' }],
        listings: [],
      } as User,
    },
    {
      role: 'a support admin',
      user: {
        id: 'support admin id',
        userRoles: { isSupportAdmin: true },
        jurisdictions: [{ id: 'juris id' }],
        listings: [],
      } as User,
    },
    {
      role: 'a limited jurisdictional admin',
      user: {
        id: 'limited juris admin id',
        userRoles: { isLimitedJurisdictionalAdmin: true },
        jurisdictions: [{ id: 'juris id' }],
        listings: [],
      } as User,
    },
    { role: 'an anonymous request', user: undefined },
  ];

  const admin = {
    id: 'admin id',
    userRoles: { isAdmin: true },
    jurisdictions: [{ id: 'juris id' }],
    listings: [],
  } as User;

  it.each(rolesBelowAdmin)(
    'should not let $role edit translations or jurisdiction content',
    async ({ user }) => {
      expect(await contentAccessFor(user)).toEqual([
        'translation.read=false',
        'translation.update=false',
        'translation.delete=false',
        'jurisdictionContent.read=false',
        'jurisdictionContent.update=false',
      ]);
    },
  );

  it('should let an admin edit translations and jurisdiction content', async () => {
    expect(await contentAccessFor(admin)).toEqual([
      'translation.read=true',
      'translation.update=true',
      'translation.delete=true',
      'jurisdictionContent.read=true',
      'jurisdictionContent.update=true',
    ]);
  });

  it.each(rolesBelowAdmin)(
    'should not let $role edit the global Partners translations',
    async ({ user }) => {
      expect(await globalTranslationAccessFor(user)).toEqual([
        'translation.read=false',
        'translation.update=false',
        'translation.delete=false',
      ]);
    },
  );

  it('should let an admin edit the global Partners translations', async () => {
    expect(await globalTranslationAccessFor(admin)).toEqual([
      'translation.read=true',
      'translation.update=true',
      'translation.delete=true',
    ]);
  });

  it('should allow anonymous to read listings', async () => {
    expect(
      await service.canOrThrow(undefined, 'listing', permissionActions.read),
    );
  });

  it('should error for anonymous user trying to write listings', async () => {
    await expect(
      async () =>
        await service.canOrThrow(
          undefined,
          'listing',
          permissionActions.create,
        ),
    ).rejects.toThrowError();
  });
});
