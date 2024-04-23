import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { stringify } from 'qs';
import { randomUUID } from 'crypto';
import {
  ApplicationReviewStatusEnum,
  FlaggedSetStatusEnum,
  ListingsStatusEnum,
  Prisma,
  RuleEnum,
  YesNoEnum,
} from '@prisma/client';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { listingFactory } from '../../prisma/seed-helpers/listing-factory';
import { applicationFactory } from '../../prisma/seed-helpers/application-factory';
import { AfsQueryParams } from 'src/dtos/application-flagged-sets/afs-query-params.dto';
import { View } from '../../src/enums/application-flagged-sets/view';
import { AfsResolve } from '../../src/dtos/application-flagged-sets/afs-resolve.dto';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { reservedCommunityTypeFactoryAll } from '../../prisma/seed-helpers/reserved-community-type-factory';

describe('Application flagged set Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminAccessToken: string;
  const createListing = async (): Promise<string> => {
    const jurisData = jurisdictionFactory();
    const jurisdiction = await prisma.jurisdictions.create({
      data: {
        ...jurisData,
        name: `${jurisData.name} ${Math.floor(Math.random() * 100)}`,
      },
    });
    await reservedCommunityTypeFactoryAll(jurisdiction.id, prisma);
    const listing1 = await listingFactory(jurisdiction.id, prisma, {
      status: ListingsStatusEnum.closed,
      afsLastRunSetInPast: true,
    });
    const listing1Created = await prisma.listings.create({
      data: listing1,
    });

    return listing1Created.id;
  };

  const createSimpleApplication = async (listingId: string) => {
    const app = await applicationFactory({ listingId });
    return await prisma.applications.create({
      data: app,
      include: {
        applicant: true,
      },
    });
  };

  const createComplexApplication = async (
    emailIndicator: string,
    nameIndicator: number,
    listing: string,
    dobIndicator?: string,
    householdMember?: Prisma.HouseholdMemberCreateWithoutApplicationsInput,
  ) => {
    return await prisma.applications.create({
      data: await applicationFactory({
        applicant: {
          emailAddress: `${listing}-email${emailIndicator}@email.com`,
          firstName: `${listing}-firstName${dobIndicator || nameIndicator}`,
          lastName: `${listing}-lastName${dobIndicator || nameIndicator}`,
          birthDay: nameIndicator,
          birthMonth: nameIndicator,
          birthYear: nameIndicator,
        },
        listingId: listing,
        householdMember: [householdMember],
      }),
      include: {
        applicant: true,
      },
    });
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    const adminUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: {
          isAdmin: true,
        },
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({ email: adminUser.email, password: 'abcdef' })
      .expect(201);
    adminAccessToken = res.header?.['set-cookie'].find((cookie) =>
      cookie.startsWith('access-token='),
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should return a list of flagged sets that are resolved', async () => {
    const listing = await createListing();

    const applicationA = await createSimpleApplication(listing);

    const applicationB = await createSimpleApplication(listing);

    const afsResolved = await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.email,
        ruleKey: `example rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.resolved,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.nameAndDOB,
        ruleKey: `a different rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.pending,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    const queryParams: AfsQueryParams = {
      listingId: listing,
      view: View.resolved,
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/applicationFlaggedSets?${query}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    expect(res.body.items.length).toEqual(1);
    expect(res.body.items[0].id).toEqual(afsResolved.id);
  });

  it('should return a list of flagged sets that are pending and flagged by nameAndDOB', async () => {
    const listing = await createListing();

    const applicationA = await createSimpleApplication(listing);

    const applicationB = await createSimpleApplication(listing);

    await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.email,
        ruleKey: `example rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.resolved,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    const afsPending = await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.nameAndDOB,
        ruleKey: `a different rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.pending,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    const queryParams: AfsQueryParams = {
      listingId: listing,
      view: View.pendingNameAndDoB,
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/applicationFlaggedSets?${query}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    expect(res.body.items.length).toEqual(1);
    expect(res.body.items[0].id).toEqual(afsPending.id);
  });

  it("should correctly gather meta data for a listing's flagged sets", async () => {
    const listing = await createListing();

    const applicationA = await createSimpleApplication(listing);

    const applicationB = await createSimpleApplication(listing);

    await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.email,
        ruleKey: `example rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.resolved,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.nameAndDOB,
        ruleKey: `a different rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.pending,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    const queryParams: AfsQueryParams = {
      listingId: listing,
    };
    const query = stringify(queryParams as any);

    const res = await request(app.getHttpServer())
      .get(`/applicationFlaggedSets/meta?${query}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    expect(res.body).toEqual({
      totalCount: 2,
      totalResolvedCount: 1,
      totalPendingCount: 1,
      totalNamePendingCount: 1,
      totalEmailPendingCount: 0,
    });
  });

  it('should get flagged set by id', async () => {
    const listing = await createListing();

    const applicationA = await createSimpleApplication(listing);

    const applicationB = await createSimpleApplication(listing);

    const resolvedAFS = await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.email,
        ruleKey: `example rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.resolved,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.nameAndDOB,
        ruleKey: `a different rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.pending,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    const res = await request(app.getHttpServer())
      .get(`/applicationFlaggedSets/${resolvedAFS.id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    expect(res.body.id).toEqual(resolvedAFS.id);
    expect(res.body.ruleKey).toEqual(resolvedAFS.ruleKey);
  });

  it('should error trying to get a flagged set that does not exist', async () => {
    const id = randomUUID();

    const res = await request(app.getHttpServer())
      .get(`/applicationFlaggedSets/${id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(404);

    expect(res.body.message).toEqual(
      `applicationFlaggedSetId ${id} was requested but not found`,
    );
  });

  it('should get flagged set by id', async () => {
    const listing = await createListing();

    const applicationA = await createSimpleApplication(listing);

    const applicationB = await createSimpleApplication(listing);

    await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.email,
        ruleKey: `example rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.resolved,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    const pendingAFS = await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.nameAndDOB,
        ruleKey: `a different rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.pending,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    const res = await request(app.getHttpServer())
      .post(`/applicationFlaggedSets/resolve`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        afsId: pendingAFS.id,
        status: FlaggedSetStatusEnum.resolved,
        applications: [
          {
            id: applicationA.id,
          },
        ],
      } as AfsResolve)
      .set('Cookie', adminAccessToken)
      .expect(201);

    expect(res.body.id).toEqual(pendingAFS.id);

    const applicationAPostResolve = await prisma.applications.findUnique({
      where: {
        id: applicationA.id,
      },
    });
    const applicationBPostResolve = await prisma.applications.findUnique({
      where: {
        id: applicationB.id,
      },
    });
    const afsPostResolve = await prisma.applicationFlaggedSet.findUnique({
      where: {
        id: pendingAFS.id,
      },
    });

    expect(applicationAPostResolve.reviewStatus).toEqual(
      ApplicationReviewStatusEnum.valid,
    );
    expect(applicationAPostResolve.markedAsDuplicate).toEqual(false);

    expect(applicationBPostResolve.reviewStatus).toEqual(
      ApplicationReviewStatusEnum.duplicate,
    );
    expect(applicationBPostResolve.markedAsDuplicate).toEqual(true);

    expect(afsPostResolve.status).toEqual(FlaggedSetStatusEnum.resolved);
  });

  it('should resolve a flagged set as resolved', async () => {
    const listing = await createListing();

    const applicationA = await createSimpleApplication(listing);

    const applicationB = await createSimpleApplication(listing);

    await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.email,
        ruleKey: `example rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.resolved,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    const pendingAFS = await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.nameAndDOB,
        ruleKey: `a different rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.pending,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    const res = await request(app.getHttpServer())
      .post(`/applicationFlaggedSets/resolve`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        afsId: pendingAFS.id,
        status: FlaggedSetStatusEnum.resolved,
        applications: [
          {
            id: applicationA.id,
          },
        ],
      } as AfsResolve)
      .set('Cookie', adminAccessToken)
      .expect(201);

    expect(res.body.id).toEqual(pendingAFS.id);

    const applicationAPostResolve = await prisma.applications.findUnique({
      where: {
        id: applicationA.id,
      },
    });
    const applicationBPostResolve = await prisma.applications.findUnique({
      where: {
        id: applicationB.id,
      },
    });
    const afsPostResolve = await prisma.applicationFlaggedSet.findUnique({
      where: {
        id: pendingAFS.id,
      },
    });

    expect(applicationAPostResolve.reviewStatus).toEqual(
      ApplicationReviewStatusEnum.valid,
    );
    expect(applicationAPostResolve.markedAsDuplicate).toEqual(false);

    expect(applicationBPostResolve.reviewStatus).toEqual(
      ApplicationReviewStatusEnum.duplicate,
    );
    expect(applicationBPostResolve.markedAsDuplicate).toEqual(true);

    expect(afsPostResolve.status).toEqual(FlaggedSetStatusEnum.resolved);
  });

  it('should resolve a flagged set as pending', async () => {
    const listing = await createListing();

    const applicationA = await createSimpleApplication(listing);

    const applicationB = await createSimpleApplication(listing);

    const resolvedAFS = await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.email,
        ruleKey: `example rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.resolved,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.nameAndDOB,
        ruleKey: `a different rule key ${listing}`,
        showConfirmationAlert: false,
        status: FlaggedSetStatusEnum.pending,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    const res = await request(app.getHttpServer())
      .post(`/applicationFlaggedSets/resolve`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        afsId: resolvedAFS.id,
        status: FlaggedSetStatusEnum.pending,
        applications: [
          {
            id: applicationA.id,
          },
        ],
      } as AfsResolve)
      .set('Cookie', adminAccessToken)
      .expect(201);

    expect(res.body.id).toEqual(resolvedAFS.id);

    const applicationAPostResolve = await prisma.applications.findUnique({
      where: {
        id: applicationA.id,
      },
    });
    const applicationBPostResolve = await prisma.applications.findUnique({
      where: {
        id: applicationB.id,
      },
    });
    const afsPostResolve = await prisma.applicationFlaggedSet.findUnique({
      where: {
        id: resolvedAFS.id,
      },
    });

    expect(applicationAPostResolve.reviewStatus).toEqual(
      ApplicationReviewStatusEnum.pendingAndValid,
    );
    expect(applicationAPostResolve.markedAsDuplicate).toEqual(false);

    expect(applicationBPostResolve.reviewStatus).toEqual(
      ApplicationReviewStatusEnum.pending,
    );
    expect(applicationBPostResolve.markedAsDuplicate).toEqual(false);

    expect(afsPostResolve.status).toEqual(FlaggedSetStatusEnum.pending);
  });

  it('should reset confirmation alert', async () => {
    const listing = await createListing();

    const applicationA = await createSimpleApplication(listing);

    const applicationB = await createSimpleApplication(listing);

    const afs = await prisma.applicationFlaggedSet.create({
      data: {
        rule: RuleEnum.email,
        ruleKey: `example rule key ${listing}`,
        showConfirmationAlert: true,
        status: FlaggedSetStatusEnum.resolved,
        listings: {
          connect: {
            id: listing,
          },
        },
        applications: {
          connect: [{ id: applicationA.id }, { id: applicationB.id }],
        },
      },
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/${afs.id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        id: afs.id,
      } as IdDTO)
      .set('Cookie', adminAccessToken)
      .expect(200);

    const afsPostReset = await prisma.applicationFlaggedSet.findUnique({
      where: {
        id: afs.id,
      },
    });

    expect(afsPostReset.showConfirmationAlert).toEqual(false);
  });

  it('should error trying to reset confirmation alert for flagged set that does not exist', async () => {
    const id = randomUUID();

    const res = await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/${id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        id: id,
      } as IdDTO)
      .set('Cookie', adminAccessToken)
      .expect(404);

    expect(res.body.message).toEqual(
      `applicationFlaggedSet ${id} was requested but not found`,
    );
  });

  it('should not create a flagged set if applications do not match', async () => {
    const listing = await createListing();

    await createComplexApplication('1', 1, listing);
    await createComplexApplication('2', 2, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    const afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
    });

    expect(afs.length).toEqual(0);
  });

  it('should create a new flagged set if applications match on email', async () => {
    const listing = await createListing();

    await createComplexApplication('1', 1, listing);
    await createComplexApplication('1', 2, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    const afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
    });

    expect(afs.length).toEqual(1);

    expect(afs[0].rule).toEqual(RuleEnum.email);
  });

  it('should create a new flagged set if applications match on nameAndDOB', async () => {
    const listing = await createListing();

    await createComplexApplication('1', 1, listing);
    await createComplexApplication('2', 1, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set('Cookie', adminAccessToken)
      .expect(200);

    const afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
    });

    expect(afs.length).toEqual(1);

    expect(afs[0].rule).toEqual(RuleEnum.nameAndDOB);
  });

  it('should create a new flagged set if applications match on nameAndDOB case insensitive', async () => {
    const listing = await createListing();

    await createComplexApplication('1', 1, listing, 'test');
    await createComplexApplication('2', 1, listing, 'TEST');

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    const afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
    });

    expect(afs.length).toEqual(1);

    expect(afs[0].rule).toEqual(RuleEnum.nameAndDOB);
  });

  it('should keep application in flagged set if email still matches', async () => {
    const listing = await createListing();

    const appA = await createComplexApplication('1', 1, listing);
    const appB = await createComplexApplication('1', 2, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    let afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.email);

    await prisma.applications.update({
      data: {
        acceptedTerms: true,
      },
      where: {
        id: appA.id,
      },
    });

    await prisma.applications.update({
      data: {
        acceptedTerms: true,
      },
      where: {
        id: appB.id,
      },
    });

    await prisma.listings.update({
      where: {
        id: listing,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.email);
    const applications = afs[0].applications.map((app) => app.id);
    expect(applications).toContain(appA.id);
    expect(applications).toContain(appB.id);
  });

  it('should keep application in flagged set if nameAndDOB still matches', async () => {
    const listing = await createListing();

    const appA = await createComplexApplication('1', 1, listing);
    const appB = await createComplexApplication('2', 1, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    let afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.nameAndDOB);

    await prisma.applications.update({
      data: {
        acceptedTerms: true,
      },
      where: {
        id: appA.id,
      },
    });

    await prisma.applications.update({
      data: {
        acceptedTerms: true,
      },
      where: {
        id: appB.id,
      },
    });

    await prisma.listings.update({
      where: {
        id: listing,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.nameAndDOB);
    const applications = afs[0].applications.map((app) => app.id);
    expect(applications).toContain(appA.id);
    expect(applications).toContain(appB.id);
  });

  it('should remove application from flagged set if email no longer matches', async () => {
    const listing = await createListing();

    const appA = await createComplexApplication('1', 1, listing);
    await createComplexApplication('1', 2, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    let afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.email);

    await prisma.applications.update({
      data: {
        acceptedTerms: true,
        applicant: {
          update: {
            where: {
              id: appA.applicantId,
            },
            data: {
              emailAddress: `${listing}-email3@email.com`,
            },
          },
        },
      },
      where: {
        id: appA.id,
      },
    });

    await prisma.listings.update({
      where: {
        id: listing,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(0);
  });

  it('should remove application from flagged set if nameAndDOB no longer matches', async () => {
    const listing = await createListing();

    const appA = await createComplexApplication('1', 1, listing);
    await createComplexApplication('2', 1, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    let afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.nameAndDOB);

    await prisma.applications.update({
      data: {
        acceptedTerms: true,
        applicant: {
          update: {
            where: {
              id: appA.applicantId,
            },
            data: {
              firstName: `${listing}-firstName3@email.com`,
              lastName: `${listing}-lastName3@email.com`,
              birthDay: 3,
              birthMonth: 3,
              birthYear: 3,
            },
          },
        },
      },
      where: {
        id: appA.id,
      },
    });

    await prisma.listings.update({
      where: {
        id: listing,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(0);
  });

  it('should remove and create flagged set if email changed', async () => {
    const listing = await createListing();

    const appA = await createComplexApplication('1', 1, listing);
    const appB = await createComplexApplication('2', 2, listing);
    const appC = await createComplexApplication('1', 3, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    let afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.email);

    let applications = afs[0].applications.map((app) => app.id);
    expect(applications).toContain(appA.id);
    expect(applications).toContain(appC.id);

    await prisma.applications.update({
      data: {
        acceptedTerms: true,
        applicant: {
          update: {
            where: {
              id: appA.applicantId,
            },
            data: {
              emailAddress: `${listing}-email2@email.com`,
            },
          },
        },
      },
      where: {
        id: appA.id,
      },
    });

    await prisma.listings.update({
      where: {
        id: listing,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    applications = afs[0].applications.map((app) => app.id);
    expect(applications).toContain(appA.id);
    expect(applications).toContain(appB.id);
  });

  it('should remove and create flagged set if nameAndDOB changed', async () => {
    const listing = await createListing();

    const appA = await createComplexApplication('1', 1, listing);
    const appB = await createComplexApplication('2', 2, listing);
    const appC = await createComplexApplication('3', 1, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    let afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.nameAndDOB);

    let applications = afs[0].applications.map((app) => app.id);
    expect(applications).toContain(appA.id);
    expect(applications).toContain(appC.id);

    await prisma.applications.update({
      data: {
        acceptedTerms: true,
        applicant: {
          update: {
            where: {
              id: appA.applicantId,
            },
            data: {
              firstName: `${listing}-firstName2`,
              lastName: `${listing}-lastName2`,
              birthDay: 2,
              birthMonth: 2,
              birthYear: 2,
            },
          },
        },
      },
      where: {
        id: appA.id,
      },
    });

    await prisma.listings.update({
      where: {
        id: listing,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set('Cookie', adminAccessToken)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .expect(200);

    afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.nameAndDOB);
    applications = afs[0].applications.map((app) => app.id);
    expect(applications).toContain(appA.id);
    expect(applications).toContain(appB.id);
  });

  it('should move application from flagged set to another if email changed', async () => {
    const listing = await createListing();

    const appA = await createComplexApplication('1', 1, listing);
    const appB = await createComplexApplication('1', 2, listing);

    const appC = await createComplexApplication('3', 3, listing);
    const appD = await createComplexApplication('3', 4, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    let afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(2);
    let allApplicationCount = 0;
    for (const flaggedSet of afs) {
      expect(flaggedSet.rule).toEqual(RuleEnum.email);
      if (flaggedSet.ruleKey.indexOf(`${listing}-email1@email.com`) >= 0) {
        const applications = flaggedSet.applications.map((app) => app.id);
        expect(applications).toContain(appA.id);
        expect(applications).toContain(appB.id);
        allApplicationCount++;
      } else if (
        flaggedSet.ruleKey.indexOf(`${listing}-email3@email.com`) >= 0
      ) {
        const applications = flaggedSet.applications.map((app) => app.id);
        expect(applications).toContain(appC.id);
        expect(applications).toContain(appD.id);
        allApplicationCount++;
      }
    }
    expect(allApplicationCount).toEqual(2);

    await prisma.applications.update({
      data: {
        acceptedTerms: true,
        applicant: {
          update: {
            where: {
              id: appA.applicantId,
            },
            data: {
              emailAddress: `${listing}-email3@email.com`,
            },
          },
        },
      },
      where: {
        id: appA.id,
      },
    });

    await prisma.listings.update({
      where: {
        id: listing,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    const applications = afs[0].applications.map((app) => app.id);
    expect(applications).toContain(appA.id);
    expect(applications).toContain(appC.id);
    expect(applications).toContain(appD.id);
  });

  it('should move application from flagged set to another if nameAndDOB changed', async () => {
    const listing = await createListing();

    const appA = await createComplexApplication('1', 1, listing);
    const appB = await createComplexApplication('2', 1, listing);

    const appC = await createComplexApplication('3', 3, listing);
    const appD = await createComplexApplication('4', 3, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    let afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(2);
    let allApplicationCount = 0;
    for (const flaggedSet of afs) {
      expect(flaggedSet.rule).toEqual(RuleEnum.nameAndDOB);
      if (flaggedSet.ruleKey.indexOf(`${listing}-firstname1`) >= 0) {
        const applications = flaggedSet.applications.map((app) => app.id);
        expect(applications).toContain(appA.id);
        allApplicationCount++;
        expect(applications).toContain(appB.id);
        allApplicationCount++;
      } else if (flaggedSet.ruleKey.indexOf(`${listing}-firstname3`) >= 0) {
        const applications = flaggedSet.applications.map((app) => app.id);
        expect(applications).toContain(appC.id);
        allApplicationCount++;
        expect(applications).toContain(appD.id);
        allApplicationCount++;
      }
    }
    expect(allApplicationCount).toEqual(4);

    await prisma.applications.update({
      data: {
        acceptedTerms: true,
        applicant: {
          update: {
            where: {
              id: appA.applicantId,
            },
            data: {
              firstName: `${listing}-firstName3`,
              lastName: `${listing}-lastName3`,
              birthDay: 3,
              birthMonth: 3,
              birthYear: 3,
            },
          },
        },
      },
      where: {
        id: appA.id,
      },
    });

    await prisma.listings.update({
      where: {
        id: listing,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    const applications = afs[0].applications.map((app) => app.id);
    expect(applications).toContain(appA.id);
    expect(applications).toContain(appC.id);
    expect(applications).toContain(appD.id);
  });

  it('should create nameAndDob flagged set on household member matches', async () => {
    const listing = await createListing();

    await createComplexApplication('1', 1, listing);
    await createComplexApplication('2', 2, listing, '2', {
      firstName: `${listing}-firstName1`,
      lastName: `${listing}-lastName1`,
      birthDay: 1,
      birthMonth: 1,
      birthYear: 1,
      sameAddress: YesNoEnum.yes,
      workInRegion: YesNoEnum.yes,
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set('Cookie', adminAccessToken)
      .expect(200);

    const afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.nameAndDOB);
  });

  it('should create nameAndDob flagged set on household member matches case insensitive', async () => {
    const listing = await createListing();

    await createComplexApplication('1', 1, listing, 'TEST');
    await createComplexApplication('2', 2, listing, '2', {
      firstName: `${listing}-firstNametest`,
      lastName: `${listing}-lastNameTest`,
      birthDay: 1,
      birthMonth: 1,
      birthYear: 1,
      sameAddress: YesNoEnum.yes,
      workInRegion: YesNoEnum.yes,
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    const afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.nameAndDOB);
  });

  it('should remove from flagged set and create new flagged set when match moves from email -> nameAndDOB', async () => {
    const listing = await createListing();

    const appA = await createComplexApplication('1', 1, listing);
    const appB = await createComplexApplication('2', 2, listing);
    const appC = await createComplexApplication('1', 3, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    let afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.email);

    let applications = afs[0].applications.map((app) => app.id);
    expect(applications).toContain(appA.id);
    expect(applications).toContain(appC.id);

    await prisma.applications.update({
      data: {
        acceptedTerms: true,
        applicant: {
          update: {
            where: {
              id: appA.applicantId,
            },
            data: {
              emailAddress: `${listing}-email4@email.com`,
              firstName: `${listing}-firstName2`,
              lastName: `${listing}-lastName2`,
              birthDay: 2,
              birthMonth: 2,
              birthYear: 2,
            },
          },
        },
      },
      where: {
        id: appA.id,
      },
    });

    await prisma.listings.update({
      where: {
        id: listing,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    applications = afs[0].applications.map((app) => app.id);
    expect(applications).toContain(appA.id);
    expect(applications).toContain(appB.id);
  });

  it('should remove from flagged set and create new flagged set when match moves from nameAndDOB -> email', async () => {
    const listing = await createListing();

    const appA = await createComplexApplication('1', 1, listing);
    const appB = await createComplexApplication('2', 2, listing);
    const appC = await createComplexApplication('3', 1, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    let afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.nameAndDOB);

    let applications = afs[0].applications.map((app) => app.id);
    expect(applications).toContain(appA.id);
    expect(applications).toContain(appC.id);

    await prisma.applications.update({
      data: {
        acceptedTerms: true,
        applicant: {
          update: {
            where: {
              id: appA.applicantId,
            },
            data: {
              emailAddress: `${listing}-email2@email.com`,
              firstName: `${listing}-firstName4`,
              lastName: `${listing}-lastName4`,
              birthDay: 4,
              birthMonth: 4,
              birthYear: 4,
            },
          },
        },
      },
      where: {
        id: appA.id,
      },
    });

    await prisma.listings.update({
      where: {
        id: listing,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.email);
    applications = afs[0].applications.map((app) => app.id);
    expect(applications).toContain(appA.id);
    expect(applications).toContain(appB.id);
  });

  it('should create new email flagged set instead of nameAndDOB flagged set', async () => {
    const listing = await createListing();

    await createComplexApplication('1', 1, listing);
    await createComplexApplication('1', 1, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    const afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.email);
  });

  it('should not reset resolved status when new application not in flagged set', async () => {
    const listing = await createListing();

    const appA = await createComplexApplication('1', 1, listing);
    await createComplexApplication('2', 1, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    let afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });
    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.nameAndDOB);

    await request(app.getHttpServer())
      .post(`/applicationFlaggedSets/resolve`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        afsId: afs[0].id,
        status: FlaggedSetStatusEnum.resolved,
        applications: [
          {
            id: appA.id,
          },
        ],
      } as AfsResolve)
      .set('Cookie', adminAccessToken)
      .expect(201);

    await createComplexApplication('3', 3, listing);
    await prisma.listings.update({
      where: {
        id: listing,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });
    expect(afs.length).toEqual(1);
    expect(afs[0].rule).toEqual(RuleEnum.nameAndDOB);
    expect(afs[0].status).toEqual(FlaggedSetStatusEnum.resolved);
  });

  it('should reset resolved status when new application in flagged set', async () => {
    const listing = await createListing();

    const appA = await createComplexApplication('1', 1, listing);
    await createComplexApplication('2', 1, listing);

    const appC = await createComplexApplication('3', 3, listing);
    await createComplexApplication('4', 3, listing);

    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    let afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    const containsAppA = afs.find((flaggedSet) =>
      flaggedSet.applications.some((app) => app.id === appA.id),
    );
    const containsAppC = afs.find((flaggedSet) =>
      flaggedSet.applications.some((app) => app.id === appC.id),
    );
    expect(afs.length).toEqual(2);
    await request(app.getHttpServer())
      .post(`/applicationFlaggedSets/resolve`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        afsId: containsAppA.id,
        status: FlaggedSetStatusEnum.resolved,
        applications: [
          {
            id: appA.id,
          },
        ],
      } as AfsResolve)
      .set('Cookie', adminAccessToken)
      .expect(201);

    await request(app.getHttpServer())
      .post(`/applicationFlaggedSets/resolve`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        afsId: containsAppC.id,
        status: FlaggedSetStatusEnum.resolved,
        applications: [
          {
            id: appC.id,
          },
        ],
      } as AfsResolve)
      .set('Cookie', adminAccessToken)
      .expect(201);

    await createComplexApplication('5', 3, listing);
    await prisma.listings.update({
      where: {
        id: listing,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });
    await request(app.getHttpServer())
      .put(`/applicationFlaggedSets/process`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .set('Cookie', adminAccessToken)
      .expect(200);

    afs = await prisma.applicationFlaggedSet.findMany({
      where: {
        listingId: listing,
      },
      include: {
        applications: true,
      },
    });

    expect(afs.length).toEqual(2);

    const unchangedFlaggedSet = afs.find(
      (flaggedSet) => flaggedSet.applications.length === 2,
    );
    const changedFlaggedSet = afs.find(
      (flaggedSet) => flaggedSet.applications.length === 3,
    );

    expect(unchangedFlaggedSet.rule).toEqual(RuleEnum.nameAndDOB);
    expect(unchangedFlaggedSet.status).toEqual(FlaggedSetStatusEnum.resolved);

    expect(changedFlaggedSet.applications.length).toEqual(3);
    expect(changedFlaggedSet.status).toEqual(FlaggedSetStatusEnum.pending);
  });
});
