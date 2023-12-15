import { Test, TestingModule } from '@nestjs/testing';
import { newEnforcer } from 'casbin';
import path from 'path';
import { UserRoleEnum } from '../../../src/enums/permissions/user-role-enum';
import { User } from '../../../src/dtos/users/user.dto';
import { PermissionService } from '../../../src/services/permission.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { permissionActions } from '../../../src/enums/permissions/permission-actions-enum';

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

  it('should add jurisdictional admin user role for user', async () => {
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
        `(${permissionActions.read}|${permissionActions.invitePartner}|${permissionActions.inviteJurisdictionalAdmin}|${permissionActions.update}|${permissionActions.delete})`,
      ),
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

    expect(
      await service.can(user, 'application', permissionActions.create, {
        listingId: 'listing id 3',
      }),
    ).toEqual(false);
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
