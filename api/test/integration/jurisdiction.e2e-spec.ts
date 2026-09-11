import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LanguagesEnum, NeighborhoodAmenitiesEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { jurisdictionFactory } from '../../prisma/seed-helpers/jurisdiction-factory';
import { JurisdictionCreate } from '../../src/dtos/jurisdictions/jurisdiction-create.dto';
import { JurisdictionUpdate } from '../../src/dtos/jurisdictions/jurisdiction-update.dto';
import { IdDTO } from '../../src/dtos/shared/id.dto';
import { userFactory } from '../../prisma/seed-helpers/user-factory';
import { Login } from '../../src/dtos/auth/login.dto';
import { ApplicationAccessibilityFeatureEnum } from '../../src/enums/applications/application-accessibility-feature-enum';
import { HouseholdMemberRelationship } from '../../src/enums/applications/household-member-relationship-enum';

describe('Jurisdiction Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookies = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app.use(cookieParser());
    await app.init();
    const storedUser = await prisma.userAccounts.create({
      data: await userFactory({
        roles: { isAdmin: true },
        mfaEnabled: false,
        confirmedAt: new Date(),
      }),
    });
    const resLogIn = await request(app.getHttpServer())
      .post('/auth/login')
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        email: storedUser.email,
        password: 'Abcdef12345!',
      } as Login)
      .expect(201);

    cookies = resLogIn.headers['set-cookie'];
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('nulls only the reference whose asset was deleted', async () => {
    const logo = await prisma.assets.create({
      data: { fileId: 'brand-logo-file', label: 'brandLogo' },
    });
    const favicon = await prisma.assets.create({
      data: { fileId: 'brand-favicon-file', label: 'brandFavicon' },
    });
    const jurisdiction = await prisma.jurisdictions.create({
      data: {
        ...jurisdictionFactory(),
        brand: { primary: { base: '#773E98' } },
        brandLogo: { connect: { id: logo.id } },
        brandFavicon: { connect: { id: favicon.id } },
      },
    });

    await prisma.assets.delete({ where: { id: logo.id } });

    const afterLogoDelete = await prisma.jurisdictions.findUnique({
      where: { id: jurisdiction.id },
    });
    expect(afterLogoDelete.brandLogoAssetId).toBeNull();
    expect(afterLogoDelete.brandFaviconAssetId).toEqual(favicon.id);

    await prisma.assets.delete({ where: { id: favicon.id } });

    const afterBothDeletes = await prisma.jurisdictions.findUnique({
      where: { id: jurisdiction.id },
    });
    expect(afterBothDeletes.brandFaviconAssetId).toBeNull();
    expect(afterBothDeletes.brand).toEqual({ primary: { base: '#773E98' } });
  });

  describe('brand', () => {
    const updateBody = (id: string, extra = {}) => ({
      id,
      name: `brand test ${id.slice(0, 8)}`,
      notificationsSignUpUrl: 'url',
      languages: [LanguagesEnum.en],
      partnerTerms: 'terms',
      publicUrl: 'publicUrl',
      emailFromAddress: 'emailFromAddress',
      rentalAssistanceDefault: 'rentalAssistanceDefault',
      whatToExpect: 'whatToExpect',
      whatToExpectAdditionalText: 'whatToExpectAdditionalText',
      whatToExpectUnderConstruction: 'whatToExpectUnderConstruction',
      enablePartnerSettings: true,
      allowSingleUseCodeLogin: true,
      listingApprovalPermissions: [],
      duplicateListingPermissions: [],
      requiredListingFields: [],
      visibleNeighborhoodAmenities: [],
      regions: [],
      visibleAccessibilityPriorityTypes: [],
      visibleApplicationAccessibilityFeatures: [],
      visibleSpokenLanguages: [],
      visibleHouseholdMemberRelationships: [],
      ...extra,
    });

    const put = (id: string, extra = {}) =>
      request(app.getHttpServer())
        .put(`/jurisdictions/${id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .set('Cookie', cookies)
        .send(updateBody(id, extra));

    it('completes the ramp and uppercases hex through the endpoints', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });

      await put(jurisdiction.id, {
        brand: { primary: { base: '#77aa33' } },
      }).expect(200);

      const res = await request(app.getHttpServer())
        .get(`/jurisdictions/byName/${updateBody(jurisdiction.id).name}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);

      expect(res.body.brand.primary.base).toEqual('#77AA33');
      expect(res.body.brand.primary.dark).toMatch(/^#[0-9A-F]{6}$/);
      expect(res.body.brand.primary.darker).toMatch(/^#[0-9A-F]{6}$/);
      expect(res.body.brand.primary.light).toMatch(/^#[0-9A-F]{6}$/);
      expect(res.body.brand.primary.lighter).toMatch(/^#[0-9A-F]{6}$/);
      expect(res.headers['cache-control']).toContain('s-maxage');

      const stored = await prisma.jurisdictions.findUnique({
        where: { id: jurisdiction.id },
        select: { brand: true },
      });
      expect(stored.brand).toEqual({ primary: { base: '#77AA33' } });
    });

    it('returns explicit ramp values as stored', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });

      const res = await put(jurisdiction.id, {
        brand: {
          primary: { base: '#773E98', dark: '#6E2598' },
          secondary: { base: '#0077DA' },
        },
      }).expect(200);

      expect(res.body.brand.primary.dark).toEqual('#6E2598');
      expect(res.body.brand.secondary.base).toEqual('#0077DA');
    });

    it('rejects a brand that is not a brand', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });

      await put(jurisdiction.id, {
        brand: { primary: { base: 'rebeccapurple' } },
      }).expect(400);
      await put(jurisdiction.id, { brand: { fontFamily: 'Inter' } }).expect(
        400,
      );
    });

    it('rejects a branding asset id with no asset', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });
      const missing = randomUUID();

      const res = await put(jurisdiction.id, {
        brandLogoAssetId: missing,
      }).expect(400);

      expect(res.body.message).toContain(missing);
    });

    it('clears the brand when null is sent', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: {
          ...jurisdictionFactory(),
          brand: { primary: { base: '#773E98' } },
        },
      });

      await put(jurisdiction.id, { brand: null }).expect(200);

      const stored = await prisma.jurisdictions.findUnique({
        where: { id: jurisdiction.id },
        select: { brand: true },
      });
      expect(stored.brand).toBeNull();
    });

    it('returns a null brand for a jurisdiction that has none', async () => {
      const jurisdiction = await prisma.jurisdictions.create({
        data: jurisdictionFactory(),
      });

      const res = await request(app.getHttpServer())
        .get(`/jurisdictions/${jurisdiction.id}`)
        .set({ passkey: process.env.API_PASS_KEY || '' })
        .expect(200);

      expect(res.body.brand).toBeNull();
    });
  });

  it('testing list endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });
    const jurisdictionB = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    const res = await request(app.getHttpServer())
      .get(`/jurisdictions?`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .expect(200);

    expect(res.body.length).toBeGreaterThanOrEqual(2);
    const jurisdictions = res.body.map((value) => value.name);
    expect(jurisdictions).toContain(jurisdictionA.name);
    expect(jurisdictions).toContain(jurisdictionB.name);
  });

  it("retrieve endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .get(`/jurisdictions/${id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .expect(404);
    expect(res.body.message).toEqual(
      `jurisdiction ${id} was requested but not found`,
    );
  });

  it('testing retrieve endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    const res = await request(app.getHttpServer())
      .get(`/jurisdictions/${jurisdictionA.id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .expect(200);

    expect(res.body.name).toEqual(jurisdictionA.name);
  });

  it("retrieve endpoint with name that doesn't exist should error", async () => {
    const name = 'a nonexistant name';
    const res = await request(app.getHttpServer())
      .get(`/jurisdictions/byName/${name}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .expect(404);
    expect(res.body.message).toEqual(
      `jurisdiction ${name} was requested but not found`,
    );
  });

  it('testing retrieveByName endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    const res = await request(app.getHttpServer())
      .get(`/jurisdictions/byName/${jurisdictionA.name}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .expect(200);

    expect(res.body.name).toEqual(jurisdictionA.name);
  });

  it('testing create endpoint', async () => {
    const createBody: JurisdictionCreate = {
      name: 'new jurisdiction',
      notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 10`,
      publicUrl: `publicUrl: 10`,
      emailFromAddress: `emailFromAddress: 10`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
      whatToExpect: `whatToExpect: 10`,
      whatToExpectAdditionalText: `whatToExpectAdditionalText: 10`,
      whatToExpectUnderConstruction: `whatToExpectUnderConstruction: 10`,
      enablePartnerSettings: true,
      allowSingleUseCodeLogin: true,
      listingApprovalPermissions: [],
      duplicateListingPermissions: [],
      requiredListingFields: [],
      visibleNeighborhoodAmenities: [
        NeighborhoodAmenitiesEnum.groceryStores,
        NeighborhoodAmenitiesEnum.pharmacies,
      ],
      regions: [],
      visibleAccessibilityPriorityTypes: [],
      visibleApplicationAccessibilityFeatures: [
        ApplicationAccessibilityFeatureEnum.mobility,
        ApplicationAccessibilityFeatureEnum.hearing,
        ApplicationAccessibilityFeatureEnum.vision,
      ],
      visibleSpokenLanguages: [],
      visibleHouseholdMemberRelationships: [
        HouseholdMemberRelationship.spousePartner,
        HouseholdMemberRelationship.girlfriendBoyfriend,
        HouseholdMemberRelationship.child,
        HouseholdMemberRelationship.parent,
        HouseholdMemberRelationship.friend,
        HouseholdMemberRelationship.brotherSister,
        HouseholdMemberRelationship.cousin,
        HouseholdMemberRelationship.auntUncle,
        HouseholdMemberRelationship.nephewNiece,
        HouseholdMemberRelationship.grandparentGreatGrandparent,
        HouseholdMemberRelationship.liveInAide,
        HouseholdMemberRelationship.other,
      ],
    };
    const res = await request(app.getHttpServer())
      .post('/jurisdictions')
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send(createBody)
      .set('Cookie', cookies)
      .expect(201);

    expect(res.body.name).toEqual('new jurisdiction');
    expect(res.body.visibleHouseholdMemberRelationships).toEqual([
      'spousePartner',
      'girlfriendBoyfriend',
      'child',
      'parent',
      'friend',
      'brotherSister',
      'cousin',
      'auntUncle',
      'nephewNiece',
      'grandparentGreatGrandparent',
      'liveInAide',
      'other',
    ]);
  });

  it("update endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const updateBody: JurisdictionUpdate = {
      id: id,
      name: 'updated name: 10',
      notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 10`,
      publicUrl: `updated publicUrl: 11`,
      emailFromAddress: `emailFromAddress: 10`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
      whatToExpect: `whatToExpect: 10`,
      whatToExpectAdditionalText: `whatToExpectAdditionalText: 10`,
      whatToExpectUnderConstruction: `whatToExpectUnderConstruction: 10`,
      enablePartnerSettings: true,
      allowSingleUseCodeLogin: true,
      listingApprovalPermissions: [],
      duplicateListingPermissions: [],
      requiredListingFields: [],
      visibleNeighborhoodAmenities: [
        NeighborhoodAmenitiesEnum.groceryStores,
        NeighborhoodAmenitiesEnum.pharmacies,
      ],
      regions: [],
      visibleAccessibilityPriorityTypes: [],
      visibleApplicationAccessibilityFeatures: [
        ApplicationAccessibilityFeatureEnum.mobility,
        ApplicationAccessibilityFeatureEnum.hearing,
        ApplicationAccessibilityFeatureEnum.vision,
      ],
      visibleSpokenLanguages: [],
      visibleHouseholdMemberRelationships: [
        HouseholdMemberRelationship.spouse,
        HouseholdMemberRelationship.child,
      ],
    };
    const res = await request(app.getHttpServer())
      .put(`/jurisdictions/${id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send(updateBody)
      .set('Cookie', cookies)
      .expect(404);
    expect(res.body.message).toEqual(
      `jurisdictionId ${id} was requested but not found`,
    );
  });

  it('testing update endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    const updateJurisdiction: JurisdictionUpdate = {
      id: jurisdictionA.id,
      name: 'updated name: 10',
      notificationsSignUpUrl: `notificationsSignUpUrl: 10`,
      languages: [LanguagesEnum.en],
      partnerTerms: `partnerTerms: 10`,
      publicUrl: `updated publicUrl: 10`,
      emailFromAddress: `emailFromAddress: 10`,
      rentalAssistanceDefault: `rentalAssistanceDefault: 10`,
      whatToExpect: `whatToExpect: 10`,
      whatToExpectAdditionalText: `whatToExpectAdditionalText: 10`,
      whatToExpectUnderConstruction: `whatToExpectUnderConstruction: 10`,
      enablePartnerSettings: true,
      allowSingleUseCodeLogin: true,
      listingApprovalPermissions: [],
      duplicateListingPermissions: [],
      requiredListingFields: [],
      visibleNeighborhoodAmenities: [
        NeighborhoodAmenitiesEnum.groceryStores,
        NeighborhoodAmenitiesEnum.pharmacies,
      ],
      regions: [],
      visibleAccessibilityPriorityTypes: [],
      visibleApplicationAccessibilityFeatures: [
        ApplicationAccessibilityFeatureEnum.mobility,
        ApplicationAccessibilityFeatureEnum.hearing,
        ApplicationAccessibilityFeatureEnum.vision,
      ],
      visibleSpokenLanguages: [],
      visibleHouseholdMemberRelationships: [
        HouseholdMemberRelationship.spousePartner,
        HouseholdMemberRelationship.child,
        HouseholdMemberRelationship.parent,
        HouseholdMemberRelationship.liveInAide,
        HouseholdMemberRelationship.other,
      ],
    };

    const res = await request(app.getHttpServer())
      .put(`/jurisdictions/${jurisdictionA.id}`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send(updateJurisdiction)
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.name).toEqual('updated name: 10');
    expect(res.body.publicUrl).toEqual('updated publicUrl: 10');
    expect(res.body.visibleHouseholdMemberRelationships).toEqual([
      'spousePartner',
      'child',
      'parent',
      'liveInAide',
      'other',
    ]);
  });

  it("delete endpoint with id that doesn't exist should error", async () => {
    const id = randomUUID();
    const res = await request(app.getHttpServer())
      .delete(`/jurisdictions`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        id: id,
      } as IdDTO)
      .set('Cookie', cookies)
      .expect(404);
    expect(res.body.message).toEqual(
      `jurisdictionId ${id} was requested but not found`,
    );
  });

  it('testing delete endpoint', async () => {
    const jurisdictionA = await prisma.jurisdictions.create({
      data: jurisdictionFactory(),
    });

    const res = await request(app.getHttpServer())
      .delete(`/jurisdictions`)
      .set({ passkey: process.env.API_PASS_KEY || '' })
      .send({
        id: jurisdictionA.id,
      } as IdDTO)
      .set('Cookie', cookies)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
