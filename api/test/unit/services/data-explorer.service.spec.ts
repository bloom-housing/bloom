import { Test, TestingModule } from '@nestjs/testing';
import { DataExplorerService } from '../../../src/services/data-explorer.service';
import { PermissionService } from '../../../src/services/permission.service';
import { DataExplorerReport } from '../../../src/dtos/applications/data-explorer/products/data-explorer-report.dto';
import { GenerateInsightResponse } from '../../../src/dtos/applications/data-explorer/generate-insight-response.dto';
import { ReportProducts } from '../../../src/dtos/applications/data-explorer/products/data-explorer-report-products.dto';

describe('DataExplorerService', () => {
  let service: DataExplorerService;

  const canOrThrowMock = jest.fn();

  const mockReportData = {
    id: 'mock-report-id',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    dateRange: '01/01/2023 - 12/31/2023',
    totalProcessedApplications: 100,
    totalApplicants: 95,
    totalListings: 5,
    validResponse: true,
    isSufficient: true,
    kAnonScore: 10,
    products: {
      incomeHouseholdSizeCrossTab: {
        '1': {
          '0-30 AMI': 45,
          '31-50 AMI': 78,
          '51-80 AMI': 92,
          '81-120 AMI': 34,
        },
        '2': {
          '0-30 AMI': 67,
          '31-50 AMI': 89,
          '51-80 AMI': 112,
          '81-120 AMI': 56,
        },
        '3': {
          '0-30 AMI': 82,
          '31-50 AMI': 95,
          '51-80 AMI': 78,
          '81-120 AMI': 45,
        },
        '4+': {
          '0-30 AMI': 93,
          '31-50 AMI': 88,
          '51-80 AMI': 65,
          '81-120 AMI': 40,
        },
      },
      raceFrequencies: [
        { count: 120, percentage: 25.5, race: 'Asian' },
        { count: 85, percentage: 18.1, race: 'Black or African American' },
        { count: 200, percentage: 42.6, race: 'White' },
        { count: 65, percentage: 13.8, race: 'Other' },
      ],
      ethnicityFrequencies: [
        { count: 150, percentage: 31.9, ethnicity: 'Hispanic or Latino' },
        {
          count: 320,
          percentage: 68.1,
          ethnicity: 'Not Hispanic or Latino',
        },
      ],
      subsidyOrVoucherTypeFrequencies: [
        { count: 75, percentage: 16.0, subsidyType: 'Section 8' },
        { count: 25, percentage: 5.3, subsidyType: 'VASH' },
        { count: 370, percentage: 78.7, subsidyType: 'None' },
      ],
      accessibilityTypeFrequencies: [
        {
          count: 45,
          percentage: 9.6,
          accessibilityType: 'Wheelchair Accessible',
        },
        {
          count: 30,
          percentage: 6.4,
          accessibilityType: 'Hearing Impaired',
        },
        {
          count: 20,
          percentage: 4.3,
          accessibilityType: 'Vision Impaired',
        },
        { count: 375, percentage: 79.8, accessibilityType: 'None' },
      ],
      ageFrequencies: [
        { count: 85, percentage: 18.1, age: '18-24' },
        { count: 120, percentage: 25.5, age: '25-34' },
        { count: 110, percentage: 23.4, age: '35-44' },
        { count: 90, percentage: 19.1, age: '45-54' },
        { count: 65, percentage: 13.8, age: '55+' },
      ],
      residentialLocationFrequencies: [
        { count: 180, percentage: 38.3, location: 'Oakland' },
        { count: 120, percentage: 25.5, location: 'Berkeley' },
        { count: 95, percentage: 20.2, location: 'San Francisco' },
        { count: 75, percentage: 16.0, location: 'Other' },
      ],
      languageFrequencies: [
        { count: 350, percentage: 74.5, language: 'English' },
        { count: 85, percentage: 18.1, language: 'Spanish' },
        { count: 25, percentage: 5.3, language: 'Chinese' },
        { count: 10, percentage: 2.1, language: 'Other' },
      ],
    },
    reportErrors: [],
  } as DataExplorerReport;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataExplorerService,
        {
          provide: PermissionService,
          useValue: {
            canOrThrow: canOrThrowMock,
          },
        },
      ],
    }).compile();

    service = module.get<DataExplorerService>(DataExplorerService);
  });

  describe('generateReport', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should throw a forbidden exception if no user is present in the request', async () => {
      await expect(
        service.generateReport({ jurisdictionId: 'test-jurisdiction' }, {
          user: null,
        } as any),
      ).rejects.toThrow('Forbidden');
      expect(canOrThrowMock).not.toHaveBeenCalled();
    });
    it('should throw a forbidden exception if user is not authorized', async () => {
      canOrThrowMock.mockRejectedValueOnce(new Error('Forbidden'));
      await expect(
        service.generateReport({ jurisdictionId: 'test-jurisdiction' }, {
          user: { id: 'test-user' },
        } as any),
      ).rejects.toThrow('Forbidden');
      expect(canOrThrowMock).toHaveBeenCalled();
    });
    it('should return report data if user is authorized', async () => {
      jest
        .spyOn(service, 'getReportDataFastAPI')
        .mockResolvedValue(mockReportData as DataExplorerReport);
      canOrThrowMock.mockResolvedValueOnce(true);

      const result = await service.generateReport(
        { jurisdictionId: 'test-jurisdiction' },
        { user: { id: 'test-user' } } as any,
      );

      expect(result).toEqual(mockReportData);
      expect(canOrThrowMock).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'test-user' }),
        'application',
        'read',
        { jurisdictionId: 'test-jurisdiction' },
      );
    });
  });

  describe('generateInsight', () => {
    const mockInsightData = {
      id: 'mock-insight-id',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      insight: '# Analysis Results\n\nThe data shows significant trends...',
    } as GenerateInsightResponse;

    const mockProductsData: ReportProducts = {
      incomeHouseholdSizeCrossTab: {
        '1': { '0-30 AMI': 45 },
      },
      raceFrequencies: [{ count: 120, percentage: 25.5, race: 'Asian' }],
      ethnicityFrequencies: [
        { count: 150, percentage: 31.9, ethnicity: 'Hispanic or Latino' },
      ],
      subsidyOrVoucherTypeFrequencies: [
        { count: 75, percentage: 16.0, subsidyType: 'Section 8' },
      ],
      accessibilityTypeFrequencies: [
        {
          count: 45,
          percentage: 9.6,
          accessibilityType: 'Wheelchair Accessible',
        },
      ],
      ageFrequencies: [{ count: 85, percentage: 18.1, age: '18-24' }],
      residentialLocationFrequencies: [
        { count: 180, percentage: 38.3, location: 'Oakland' },
      ],
      languageFrequencies: [
        { count: 350, percentage: 74.5, language: 'English' },
      ],
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should throw a forbidden exception if no user is present in the request', async () => {
      await expect(
        service.generateInsight(
          {
            data: mockProductsData,
            jurisdictionId: 'test-jurisdiction',
          },
          {
            user: null,
          } as any,
        ),
      ).rejects.toThrow('Forbidden');
      expect(canOrThrowMock).not.toHaveBeenCalled();
    });

    it('should throw a forbidden exception if user is not authorized', async () => {
      canOrThrowMock.mockRejectedValueOnce(new Error('Forbidden'));
      await expect(
        service.generateInsight(
          {
            data: mockProductsData,
            jurisdictionId: 'test-jurisdiction',
          },
          { user: { id: 'test-user' } } as any,
        ),
      ).rejects.toThrow('Forbidden');
      expect(canOrThrowMock).toHaveBeenCalled();
    });

    it('should return insight data if user is authorized', async () => {
      jest
        .spyOn(service, 'getInsightFromFastAPI')
        .mockResolvedValue(mockInsightData as GenerateInsightResponse);
      canOrThrowMock.mockResolvedValueOnce(true);

      const result = await service.generateInsight(
        {
          data: mockProductsData,
          jurisdictionId: 'test-jurisdiction',
        },
        { user: { id: 'test-user' } } as any,
      );

      expect(result).toEqual(mockInsightData);
      expect(canOrThrowMock).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'test-user' }),
        'application',
        'read',
        { jurisdictionId: 'test-jurisdiction' },
      );
    });

    it('should not call authorization if no jurisdictionId is provided', async () => {
      jest
        .spyOn(service, 'getInsightFromFastAPI')
        .mockResolvedValue(mockInsightData as GenerateInsightResponse);

      const result = await service.generateInsight(
        {
          data: mockProductsData,
        },
        { user: { id: 'test-user' } } as any,
      );

      expect(result).toEqual(mockInsightData);
      expect(canOrThrowMock).not.toHaveBeenCalled();
    });
  });
});
