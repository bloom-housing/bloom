import { Test, TestingModule } from '@nestjs/testing';
import {
  LanguagesEnum,
  ListingsStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { Listing } from '../../../src/dtos/listings/listing.dto';
import { GoogleTranslateService } from '../../../src/services/google-translate.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { TranslationService } from '../../../src/services/translation.service';

const mockListing = (): Listing => {
  return {
    id: 'id 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    accessibility: 'untranslated accessibility',
    amenities: 'untranslated amenities',
    applicationDropOffAddressOfficeHours:
      'untranslated application drop off address office hours',
    applicationPickUpAddressOfficeHours:
      'untranslated application pick up address office hours',
    communityDisclaimerDescription:
      'untranslated community disclaimer description',
    communityDisclaimerTitle: 'untranslated community disclaimer title',
    contentUpdatedAt: new Date(),
    costsNotIncluded: 'untranslated costs not included',
    creditHistory: 'untranslated credit history',
    criminalBackground: 'untranslated criminal background',
    depositHelperText: 'untranslated deposit helper text',
    depositMax: 'untranslated deposit maximum',
    depositMin: 'untranslated deposit minimum',
    displayWaitlistSize: true,
    includeCommunityDisclaimer: true,
    leasingAgentOfficeHours: 'untranslated leasing agent office hours',
    name: 'listing 1',
    neighborhood: 'untranslated neighborhood',
    petPolicy: 'untranslated pet policy',
    programRules: 'untranslated program rules',
    rentalAssistance: 'untranslated rental assistance',
    rentalHistory: 'untranslated rental history',
    requiredDocuments: 'untranslated required documents',
    reservedCommunityDescription: 'untranslated reserved community description',
    servicesOffered: 'untranslated services offered',
    showWaitlist: true,
    smokingPolicy: 'untranslated smoking policy',
    specialNotes: 'untranslated special notes',
    status: ListingsStatusEnum.active,
    unitAmenities: 'untranslated unit amenities',
    whatToExpect: 'untranslated what to expect',

    applicationLotteryTotals: [],
    applicationMethods: [],
    assets: [],
    jurisdictions: {
      id: 'jurisdiction id 1',
      name: 'jurisdiction',
    },
    listingsBuildingAddress: {
      id: 'address id 1',
      city: 'bloom city',
      state: 'Bloom',
      street: '123 main street',
      zipCode: '12345',
    },
    listingEvents: [],
    listingMultiselectQuestions: [
      {
        multiselectQuestions: {
          id: 'multiselectQuestions id 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.preferences,
          description: 'untranslated multiselect description',
          jurisdictions: [],
          multiselectOptions: [
            {
              id: '',
              createdAt: undefined,
              updatedAt: undefined,
              description: 'untranslated multiselectOption description',
              name: 'untranslated multiselectOption name',
              ordinal: 0,
              text: '',
            },
          ],
          name: 'untranslated multiselect name',
          optOutText: 'untranslated multiselect opt out text',
          options: [
            {
              id: '',
              createdAt: undefined,
              updatedAt: undefined,
              description: 'untranslated multiselectOption description',
              name: '',
              ordinal: 0,
              text: 'untranslated multiselectOption text',
            },
          ],
          status: 'active',
          subText: 'untranslated multiselect subtext',
          text: 'untranslated multiselect text',
        },
      },
    ],
    listingNeighborhoodAmenities: {
      groceryStores: 'untranslated grocery stores',
      publicTransportation: 'untranslated public transportation',
      schools: 'untranslated schools',
      parksAndCommunityCenters: 'untranslated parks and community centers',
      pharmacies: 'untranslated pharmacies',
      healthCareResources: 'untranslated health care resources',
      id: '',
    },
    property: {
      id: 'property id 1',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'property 1',
      description: 'untranslated property description',
      urlTitle: 'untranslated property url title',
    },
    referralApplication: {
      externalReference: 'untranslated external reference',
      type: 'Referral',
      id: 'referral application',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    units: [],
    unitsSummarized: undefined,
    unitsSummary: [],
  };
};

const translatedStrings = (enableV2MSQ?: boolean) => {
  return [
    'translated accessibility',
    'translated amenities',
    'translated application drop off address office hours',
    'translated application pick up address office hours',
    'translated costs not included',
    'translated credit history',
    'translated criminal background',
    'translated deposit helper text',
    'translated deposit maximum',
    'translated deposit minimum',
    'translated leasing agent office hours',
    'translated neighborhood',
    'translated pet policy',
    'translated program rules',
    'translated rental assistance',
    'translated rental history',
    'translated required documents',
    'translated reserved community description',
    'translated services offered',
    'translated smoking policy',
    'translated special notes',
    'translated unit amenities',
    'translated what to expect',
    'translated grocery stores',
    'translated public transportation',
    'translated schools',
    'translated parks and community centers',
    'translated pharmacies',
    'translated health care resources',
    'translated external reference',
    'translated community disclaimer title',
    'translated community disclaimer description',
    'translated property description',
    'translated property url title',
    enableV2MSQ ? 'translated multiselect name' : null,
    'translated multiselect description',
    'translated multiselect subtext',
    enableV2MSQ ? 'translated multiselectOption name' : null,
    enableV2MSQ ? 'translated multiselectOption description' : null,
    !enableV2MSQ ? 'translated multiselect text' : null,
    !enableV2MSQ ? 'translated multiselectOption text' : null,
    !enableV2MSQ ? 'translated multiselectOption description' : null,
    !enableV2MSQ ? 'translated multiselect opt out text' : null,
  ];
};

describe('Testing translations service', () => {
  let service: TranslationService;
  let prisma: PrismaService;
  let googleTranslateServiceMock;
  let mockConsoleWarn;

  beforeEach(async () => {
    googleTranslateServiceMock = {
      isConfigured: () => true,
      fetch: jest.fn(),
    };
    mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationService,
        PrismaService,
        {
          provide: GoogleTranslateService,
          useValue: googleTranslateServiceMock,
        },
      ],
    }).compile();

    service = module.get<TranslationService>(TranslationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    mockConsoleWarn.mockRestore();
  });

  describe('getMergedTranslations', () => {
    it('Should get merged translations for just english and null jurisdiction', async () => {
      const nullJurisdiction = {
        value: 'null jurisdiction',
        extraValue: 'extra value',
      };
      prisma.translations.findFirst = jest
        .fn()
        .mockResolvedValueOnce({ translations: nullJurisdiction });
      const result = await service.getMergedTranslations(null);
      expect(prisma.translations.findFirst).toBeCalledTimes(1);
      expect(result).toEqual(nullJurisdiction);
    });

    it('Should get merged translations for jurisdiction in english', async () => {
      const nullJurisdiction = {
        value: 'null jurisdiction',
        extraValue: 'extra value',
      };
      const englishJurisdictionValue = {
        value: 'jurisdiction english',
      };
      prisma.translations.findFirst = jest
        .fn()
        .mockResolvedValueOnce({ translations: englishJurisdictionValue })
        .mockResolvedValueOnce({ translations: nullJurisdiction });
      const result = await service.getMergedTranslations(randomUUID());
      expect(prisma.translations.findFirst).toBeCalledTimes(2);
      expect(result).toEqual({
        value: 'jurisdiction english',
        extraValue: 'extra value',
      });
    });

    it('Should get merged translations for just non-english and active jurisdiction', async () => {
      const nullJurisdiction = {
        value: 'null jurisdiction',
        extraValue: 'extra value',
      };
      const englishJurisdictionValue = {
        value: 'jurisdiction english',
      };
      const spanishJurisdictionValue = {
        value: 'jurisdiction spanish',
      };
      const spanishNullValue = {
        value: 'null jurisdiction',
        extraValue: 'extra spanish',
      };
      prisma.translations.findFirst = jest
        .fn()
        .mockResolvedValueOnce({ translations: spanishJurisdictionValue })
        .mockResolvedValueOnce({ translations: spanishNullValue })
        .mockResolvedValueOnce({ translations: englishJurisdictionValue })
        .mockResolvedValueOnce({ translations: nullJurisdiction });
      const result = await service.getMergedTranslations(
        randomUUID(),
        LanguagesEnum.es,
      );
      expect(prisma.translations.findFirst).toBeCalledTimes(4);
      expect(result).toEqual({
        value: 'jurisdiction spanish',
        extraValue: 'extra spanish',
      });
    });
  });

  describe('getTranslationByLanguageAndJurisdiction', () => {
    it('Should get unique translations by language and jurisdiction', async () => {
      const jurisdictionId = randomUUID();
      const translations = {
        id: 'translations id 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        language: LanguagesEnum.en,
        jurisdictionId: jurisdictionId,
        translations: {
          translation1: 'translation 1',
          translation2: 'translation 2',
        },
      };
      prisma.jurisdictions.findUnique = jest.fn().mockResolvedValue({
        id: jurisdictionId,
      });
      prisma.translations.findFirst = jest
        .fn()
        .mockResolvedValueOnce(translations);

      const result = await service.getTranslationByLanguageAndJurisdiction(
        LanguagesEnum.es,
        jurisdictionId,
      );

      expect(result).toEqual(translations);
      expect(prisma.translations.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('translateListing', () => {
    it('Should fetch translations and translate listing if not in db', async () => {
      googleTranslateServiceMock.fetch.mockResolvedValueOnce([
        translatedStrings(),
      ]);
      prisma.generatedListingTranslations.findFirst = jest
        .fn()
        .mockResolvedValue(null);
      prisma.generatedListingTranslations.create = jest
        .fn()
        .mockResolvedValue(null);

      const result = await service.translateListing(
        mockListing() as Listing,
        LanguagesEnum.es,
      );
      expect(googleTranslateServiceMock.fetch).toHaveBeenCalledTimes(1);
      expect(
        prisma.generatedListingTranslations.findFirst,
      ).toHaveBeenCalledTimes(1);
      expect(prisma.generatedListingTranslations.create).toHaveBeenCalledTimes(
        1,
      );
      validateTranslatedFields(result);
    });

    it('Should fetch translations and translate listing if not in db with enableV2MSQ as true', async () => {
      googleTranslateServiceMock.fetch.mockResolvedValueOnce([
        translatedStrings(true),
      ]);
      prisma.generatedListingTranslations.findFirst = jest
        .fn()
        .mockResolvedValue(null);
      prisma.generatedListingTranslations.create = jest
        .fn()
        .mockResolvedValue(null);

      const result = await service.translateListing(
        mockListing() as Listing,
        LanguagesEnum.es,
      );
      expect(googleTranslateServiceMock.fetch).toHaveBeenCalledTimes(1);
      expect(
        prisma.generatedListingTranslations.findFirst,
      ).toHaveBeenCalledTimes(1);
      expect(prisma.generatedListingTranslations.create).toHaveBeenCalledTimes(
        1,
      );
      validateTranslatedFields(result, true);
    });

    it('Should fetch translations and translate listing if db translations outdated', async () => {
      googleTranslateServiceMock.fetch.mockResolvedValueOnce([
        translatedStrings(),
      ]);
      prisma.generatedListingTranslations.findFirst = jest
        .fn()
        .mockResolvedValue({
          createdAt: dayjs(new Date()).subtract(1, 'days').toDate(),
          id: randomUUID(),
          translations: [translatedStrings()],
        });
      prisma.generatedListingTranslations.delete = jest
        .fn()
        .mockResolvedValue(null);
      prisma.generatedListingTranslations.create = jest
        .fn()
        .mockResolvedValue(null);

      const result = await service.translateListing(
        mockListing() as Listing,
        LanguagesEnum.es,
      );
      expect(googleTranslateServiceMock.fetch).toHaveBeenCalledTimes(1);
      expect(
        prisma.generatedListingTranslations.findFirst,
      ).toHaveBeenCalledTimes(1);
      expect(prisma.generatedListingTranslations.delete).toHaveBeenCalledTimes(
        1,
      );
      validateTranslatedFields(result);
    });

    it('Should fetch translations from db and translate listing', async () => {
      prisma.generatedListingTranslations.findFirst = jest
        .fn()
        .mockResolvedValue({ translations: [translatedStrings()] });

      const result = await service.translateListing(
        mockListing() as Listing,
        LanguagesEnum.es,
      );
      expect(googleTranslateServiceMock.fetch).toHaveBeenCalledTimes(0);
      expect(
        prisma.generatedListingTranslations.findFirst,
      ).toHaveBeenCalledTimes(1);
      validateTranslatedFields(result);
    });
  });
});

const validateTranslatedFields = (listing: Listing, enableV2MSQ?: boolean) => {
  expect(listing.accessibility).toEqual('translated accessibility');
  expect(listing.amenities).toEqual('translated amenities');
  expect(listing.applicationPickUpAddressOfficeHours).toEqual(
    'translated application pick up address office hours',
  );
  expect(listing.applicationDropOffAddressOfficeHours).toEqual(
    'translated application drop off address office hours',
  );
  expect(listing.costsNotIncluded).toEqual('translated costs not included');
  expect(listing.creditHistory).toEqual('translated credit history');
  expect(listing.criminalBackground).toEqual('translated criminal background');
  expect(listing.depositHelperText).toEqual('translated deposit helper text');
  expect(listing.depositMax).toEqual('translated deposit maximum');
  expect(listing.depositMin).toEqual('translated deposit minimum');
  expect(listing.leasingAgentOfficeHours).toEqual(
    'translated leasing agent office hours',
  );
  expect(listing.neighborhood).toEqual('translated neighborhood');
  expect(listing.petPolicy).toEqual('translated pet policy');
  expect(listing.programRules).toEqual('translated program rules');
  expect(listing.rentalAssistance).toEqual('translated rental assistance');
  expect(listing.rentalHistory).toEqual('translated rental history');
  expect(listing.requiredDocuments).toEqual('translated required documents');
  expect(listing.reservedCommunityDescription).toEqual(
    'translated reserved community description',
  );
  expect(listing.servicesOffered).toEqual('translated services offered');
  expect(listing.smokingPolicy).toEqual('translated smoking policy');
  expect(listing.specialNotes).toEqual('translated special notes');
  expect(listing.unitAmenities).toEqual('translated unit amenities');
  expect(listing.whatToExpect).toEqual('translated what to expect');

  expect(listing.referralApplication.externalReference).toEqual(
    'translated external reference',
  );
  expect(listing.property.description).toEqual(
    'translated property description',
  );
  expect(listing.property.urlTitle).toEqual('translated property url title');
  expect(listing.listingNeighborhoodAmenities.groceryStores).toEqual(
    'translated grocery stores',
  );
  expect(listing.listingNeighborhoodAmenities.publicTransportation).toEqual(
    'translated public transportation',
  );
  expect(listing.listingNeighborhoodAmenities.schools).toEqual(
    'translated schools',
  );
  expect(listing.listingNeighborhoodAmenities.parksAndCommunityCenters).toEqual(
    'translated parks and community centers',
  );
  expect(listing.listingNeighborhoodAmenities.pharmacies).toEqual(
    'translated pharmacies',
  );
  expect(listing.listingNeighborhoodAmenities.healthCareResources).toEqual(
    'translated health care resources',
  );
  expect(listing.communityDisclaimerTitle).toEqual(
    'translated community disclaimer title',
  );
  expect(listing.communityDisclaimerDescription).toEqual(
    'translated community disclaimer description',
  );

  expect(
    listing.listingMultiselectQuestions[0].multiselectQuestions.description,
  ).toEqual('translated multiselect description');
  expect(
    listing.listingMultiselectQuestions[0].multiselectQuestions.subText,
  ).toEqual('translated multiselect subtext');
  if (!enableV2MSQ) {
    expect(
      listing.listingMultiselectQuestions[0].multiselectQuestions.text,
    ).toEqual('translated multiselect text');
    expect(
      listing.listingMultiselectQuestions[0].multiselectQuestions.options[0]
        .text,
    ).toEqual('translated multiselectOption text');
    expect(
      listing.listingMultiselectQuestions[0].multiselectQuestions.options[0]
        .description,
    ).toEqual('translated multiselectOption description');
    expect(
      listing.listingMultiselectQuestions[0].multiselectQuestions.optOutText,
    ).toEqual('translated multiselect opt out text');
  } else {
    expect(
      listing.listingMultiselectQuestions[0].multiselectQuestions.name,
    ).toEqual('translated multiselect name');
    expect(
      listing.listingMultiselectQuestions[0].multiselectQuestions
        .multiselectOptions[0].name,
    ).toEqual('translated multiselectOption name');
    expect(
      listing.listingMultiselectQuestions[0].multiselectQuestions
        .multiselectOptions[0].description,
    ).toEqual('translated multiselectOption description');
  }
};
