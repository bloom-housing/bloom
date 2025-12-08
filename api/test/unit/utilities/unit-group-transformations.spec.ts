import { AmiChart } from '../../../src/dtos/ami-charts/ami-chart.dto';
import { MinMax } from '../../../src/dtos/shared/min-max.dto';
import { UnitGroup } from '../../../src/dtos/unit-groups/unit-group.dto';
import { MonthlyRentDeterminationTypeEnum, UnitTypeEnum } from '@prisma/client';
import {
  setMinMax,
  getUnitGroupSummary,
  getHouseholdMaxIncomeSummary,
  summarizeUnitGroups,
} from '../../../src/utilities/unit-groups-transformations';

const defaultValues = {
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Unit Group Transformations', () => {
  describe('setMinMax', () => {
    it('should create a new range when input range is null', () => {
      const result = setMinMax(null, 100);
      expect(result).toEqual({ min: 100, max: 100 });
    });

    it('should update min when value is less than current min', () => {
      const range: MinMax = { min: 100, max: 200 };
      const result = setMinMax(range, 50);
      expect(result).toEqual({ min: 50, max: 200 });
    });

    it('should update max when value is greater than current max', () => {
      const range: MinMax = { min: 100, max: 200 };
      const result = setMinMax(range, 300);
      expect(result).toEqual({ min: 100, max: 300 });
    });

    it('should not change range when value is between min and max', () => {
      const range: MinMax = { min: 100, max: 200 };
      const result = setMinMax(range, 150);
      expect(result).toEqual({ min: 100, max: 200 });
    });
  });

  describe('getUnitGroupSummary', () => {
    it('should return empty array for empty input', () => {
      expect(getUnitGroupSummary([])).toEqual([]);
      expect(getUnitGroupSummary(null)).toEqual([]);
    });

    it('should correctly summarize a single unit group with flat rent', () => {
      const unitGroups: UnitGroup[] = [
        {
          ...defaultValues,
          id: 'group1',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type1',
              name: UnitTypeEnum.studio,
              numBedrooms: 0,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 30,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 1000,
            },
          ],
          openWaitlist: true,
          totalAvailable: 5,
          bathroomMin: 1,
          bathroomMax: 1,
          floorMin: 1,
          floorMax: 1,
          sqFeetMin: 500,
          sqFeetMax: 500,
        },
      ];

      const result = getUnitGroupSummary(unitGroups);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        unitTypes: [
          {
            id: 'type1',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            name: UnitTypeEnum.studio,
            numBedrooms: 0,
          },
        ],
        rentAsPercentIncomeRange: undefined,
        rentRange: {
          min: '$1000',
          max: '$1000',
        },
        amiPercentageRange: {
          min: 30,
          max: 30,
        },
        openWaitlist: true,
        unitVacancies: 5,
        bathroomRange: {
          min: 1,
          max: 1,
        },
        floorRange: {
          min: 1,
          max: 1,
        },
        sqFeetRange: {
          min: 500,
          max: 500,
        },
      });
    });

    it('should correctly summarize a single unit group with percentage of income rent', () => {
      const unitGroups: UnitGroup[] = [
        {
          ...defaultValues,
          id: 'group1',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type1',
              name: UnitTypeEnum.oneBdrm,
              numBedrooms: 1,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 30,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.percentageOfIncome,
              percentageOfIncomeValue: 30,
            },
          ],
          openWaitlist: false,
          totalAvailable: 2,
          bathroomMin: 1,
          bathroomMax: 1,
          floorMin: 2,
          floorMax: 3,
          sqFeetMin: 600,
          sqFeetMax: 700,
        },
      ];

      const result = getUnitGroupSummary(unitGroups);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        unitTypes: [
          {
            id: 'type1',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            name: UnitTypeEnum.oneBdrm,
            numBedrooms: 1,
          },
        ],
        rentAsPercentIncomeRange: {
          min: 30,
          max: 30,
        },
        rentRange: undefined,
        amiPercentageRange: {
          min: 30,
          max: 30,
        },
        openWaitlist: false,
        unitVacancies: 2,
        bathroomRange: {
          min: 1,
          max: 1,
        },
        floorRange: {
          min: 2,
          max: 3,
        },
        sqFeetRange: {
          min: 600,
          max: 700,
        },
      });
    });

    it('should correctly summarize multiple unit groups with mixed rent types', () => {
      const unitGroups: UnitGroup[] = [
        {
          ...defaultValues,
          id: 'group1',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type1',
              name: UnitTypeEnum.studio,
              numBedrooms: 0,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 30,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 1000,
            },
          ],
          openWaitlist: true,
          totalAvailable: 5,
          bathroomMin: 1,
          bathroomMax: 1,
          floorMin: 1,
          floorMax: 1,
          sqFeetMin: 500,
          sqFeetMax: 500,
        },
        {
          ...defaultValues,
          id: 'group2',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type2',
              name: UnitTypeEnum.oneBdrm,
              numBedrooms: 1,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level2',
              amiPercentage: 50,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.percentageOfIncome,
              percentageOfIncomeValue: 30,
            },
            {
              ...defaultValues,
              id: 'level3',
              amiPercentage: 80,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 1500,
            },
          ],
          openWaitlist: false,
          totalAvailable: 3,
          bathroomMin: 1,
          bathroomMax: 2,
          floorMin: 2,
          floorMax: 4,
          sqFeetMin: 700,
          sqFeetMax: 900,
        },
      ];

      const result = getUnitGroupSummary(unitGroups);

      expect(result).toHaveLength(2);
      expect(result[0].unitTypes).toEqual([
        {
          id: 'type1',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          name: UnitTypeEnum.studio,
          numBedrooms: 0,
        },
      ]);
      expect(result[1].unitTypes).toEqual([
        {
          id: 'type2',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          name: UnitTypeEnum.oneBdrm,
          numBedrooms: 1,
        },
      ]);
      expect(result[0]).toEqual({
        unitTypes: [
          {
            id: 'type1',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            name: UnitTypeEnum.studio,
            numBedrooms: 0,
          },
        ],
        rentRange: {
          min: '$1000',
          max: '$1000',
        },
        amiPercentageRange: {
          min: 30,
          max: 30,
        },
        openWaitlist: true,
        unitVacancies: 5,
        bathroomRange: {
          min: 1,
          max: 1,
        },
        floorRange: {
          min: 1,
          max: 1,
        },
        sqFeetRange: {
          min: 500,
          max: 500,
        },
      });
    });

    it('should properly sort multiple unit groups by unit types and AMI percentage', () => {
      const unitGroups: UnitGroup[] = [
        {
          ...defaultValues,
          id: 'unit_group_1',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type_1',
              name: UnitTypeEnum.oneBdrm,
              numBedrooms: 1,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 30,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.percentageOfIncome,
              flatRentValue: 30,
            },
          ],
        },
        {
          ...defaultValues,
          id: 'unit_group_2',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type_3',
              name: UnitTypeEnum.threeBdrm,
              numBedrooms: 3,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 20,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.percentageOfIncome,
              flatRentValue: 30,
            },
          ],
        },
        {
          ...defaultValues,
          id: 'unit_group_3',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type_1',
              name: UnitTypeEnum.oneBdrm,
              numBedrooms: 1,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 60,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.percentageOfIncome,
              flatRentValue: 30,
            },
          ],
        },
        {
          ...defaultValues,
          id: 'unit_group_1',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type_2',
              name: UnitTypeEnum.twoBdrm,
              numBedrooms: 2,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 50,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.percentageOfIncome,
              flatRentValue: 30,
            },
          ],
        },
        {
          ...defaultValues,
          id: 'unit_group_1',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type_1',
              name: UnitTypeEnum.oneBdrm,
              numBedrooms: 1,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 10,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.percentageOfIncome,
              flatRentValue: 30,
            },
          ],
        },
      ];

      const result = getUnitGroupSummary(unitGroups);
      expect(result).toHaveLength(5);

      const [rowOne, rowTwo, rowThree, rowFour, rowFive] = result;
      expect(rowOne).toMatchObject({
        unitTypes: [
          {
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            id: 'type_1',
            name: UnitTypeEnum.oneBdrm,
            numBedrooms: 1,
          },
        ],
        amiPercentageRange: { max: 10, min: 10 },
      });
      expect(rowTwo).toMatchObject({
        unitTypes: [
          {
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            id: 'type_1',
            name: UnitTypeEnum.oneBdrm,
            numBedrooms: 1,
          },
        ],
        amiPercentageRange: { max: 30, min: 30 },
      });
      expect(rowThree).toMatchObject({
        unitTypes: [
          {
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            id: 'type_1',
            name: UnitTypeEnum.oneBdrm,
            numBedrooms: 1,
          },
        ],
        amiPercentageRange: { max: 60, min: 60 },
      });
      expect(rowFour).toMatchObject({
        unitTypes: [
          {
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            id: 'type_2',
            name: UnitTypeEnum.twoBdrm,
            numBedrooms: 2,
          },
        ],
        amiPercentageRange: { max: 50, min: 50 },
      });
      expect(rowFive).toMatchObject({
        unitTypes: [
          {
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            id: 'type_3',
            name: UnitTypeEnum.threeBdrm,
            numBedrooms: 3,
          },
        ],
        amiPercentageRange: { max: 20, min: 20 },
      });
    });
  });

  describe('getHouseholdMaxIncomeSummary', () => {
    const generateAmiChartItems = (
      maxHousehold: number,
      percentages: number[],
      baseAmount: number,
    ) => {
      const items = [];
      for (let size = 1; size <= maxHousehold; size++) {
        for (const percentage of percentages) {
          items.push({
            percentOfAmi: percentage,
            householdSize: size,
            income: baseAmount + 1000 * size + percentage * 100,
          });
        }
      }
      return items;
    };

    const generateAmiChart = (percentages: number[]): AmiChart => {
      return {
        ...defaultValues,
        id: 'ami1',
        name: 'AMI Chart 1',
        jurisdictions: {
          id: 'jurisdiction1',
        },
        items: generateAmiChartItems(8, percentages, 30000),
      };
    };

    it('should return empty data when no unit groups are provided', () => {
      const result = getHouseholdMaxIncomeSummary(
        [],
        [generateAmiChart([30, 50, 80])],
      );
      expect(result).toEqual({
        columns: { householdSize: 'householdSize' },
        rows: [],
      });
    });

    it('should return empty data when no AMI charts are provided', () => {
      const unitGroups: UnitGroup[] = [
        {
          ...defaultValues,
          id: 'group1',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type1',
              name: UnitTypeEnum.studio,
              numBedrooms: 0,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 30,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 1000,
            },
          ],
          minOccupancy: 1,
          maxOccupancy: 2,
        },
      ];

      const result = getHouseholdMaxIncomeSummary(unitGroups, []);
      expect(result).toEqual({
        columns: { householdSize: 'householdSize' },
        rows: [],
      });
    });
    it('should return empty data with no occupancy information', () => {
      const unitGroups: UnitGroup[] = [
        {
          ...defaultValues,
          id: 'group1',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type1',
              name: UnitTypeEnum.studio,
              numBedrooms: 0,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 30,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 1000,
            },
          ],
          minOccupancy: null,
          maxOccupancy: null,
        },
        {
          ...defaultValues,
          id: 'group2',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type2',
              name: UnitTypeEnum.oneBdrm,
              numBedrooms: 1,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level2',
              amiPercentage: 50,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.percentageOfIncome,
              percentageOfIncomeValue: 30,
            },
          ],
          minOccupancy: null,
          maxOccupancy: null,
        },
      ];

      const result = getHouseholdMaxIncomeSummary(unitGroups, []);
      expect(result).toEqual({
        columns: { householdSize: 'householdSize' },
        rows: [],
      });
    });

    it('should correctly generate household max income summary', () => {
      const unitGroups: UnitGroup[] = [
        {
          ...defaultValues,
          id: 'group1',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type1',
              name: UnitTypeEnum.studio,
              numBedrooms: 0,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 30,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 1000,
            },
          ],
          minOccupancy: 1,
          maxOccupancy: 2,
        },
        {
          ...defaultValues,
          id: 'group2',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type2',
              name: UnitTypeEnum.oneBdrm,
              numBedrooms: 1,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level2',
              amiPercentage: 50,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.percentageOfIncome,
              percentageOfIncomeValue: 30,
            },
          ],
          minOccupancy: 1,
          maxOccupancy: 3,
        },
      ];

      const amiChart = generateAmiChart([30, 50]);
      const result = getHouseholdMaxIncomeSummary(unitGroups, [amiChart]);

      expect(result.columns).toEqual({
        householdSize: 'householdSize',
        percentage30: 30,
        percentage50: 50,
      });

      expect(result.rows).toHaveLength(3);

      expect(result.rows[0]).toEqual({
        householdSize: '1',
        percentage30: '$34,000',
        percentage50: '$36,000',
      });

      expect(result.rows[1]).toEqual({
        householdSize: '2',
        percentage30: '$35,000',
        percentage50: '$37,000',
      });

      expect(result.rows[2]).toEqual({
        householdSize: '3',
        percentage30: '$36,000',
        percentage50: '$38,000',
      });
    });

    it('should correctly handle multiple AMI charts with different income values', () => {
      const unitGroups: UnitGroup[] = [
        {
          ...defaultValues,
          id: 'group1',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type1',
              name: UnitTypeEnum.studio,
              numBedrooms: 0,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 30,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 1000,
            },
            {
              ...defaultValues,
              id: 'level2',
              amiPercentage: 50,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 1500,
            },
            {
              ...defaultValues,
              id: 'level3',
              amiPercentage: 80,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 2000,
            },
          ],
          minOccupancy: 1,
          maxOccupancy: 3,
        },
      ];

      // Create two AMI charts with different base amounts
      // First chart with lower income values
      const amiChart1 = {
        ...defaultValues,
        id: 'ami1',
        name: 'AMI Chart 1',
        jurisdictions: {
          id: 'jurisdiction1',
        },
        items: [
          { percentOfAmi: 30, householdSize: 1, income: 31000 },
          { percentOfAmi: 30, householdSize: 2, income: 32000 },
          { percentOfAmi: 30, householdSize: 3, income: 33000 },
          { percentOfAmi: 50, householdSize: 1, income: 35000 },
          { percentOfAmi: 50, householdSize: 2, income: 36000 },
          { percentOfAmi: 50, householdSize: 3, income: 37000 },
          { percentOfAmi: 80, householdSize: 1, income: 38000 },
          { percentOfAmi: 80, householdSize: 2, income: 39000 },
          { percentOfAmi: 80, householdSize: 3, income: 40000 },
        ],
      };

      // Second chart with higher income values
      const amiChart2 = {
        ...defaultValues,
        id: 'ami2',
        name: 'AMI Chart 2',
        jurisdictions: {
          id: 'jurisdiction1',
        },
        items: [
          { percentOfAmi: 30, householdSize: 1, income: 41000 },
          { percentOfAmi: 30, householdSize: 2, income: 42000 },
          { percentOfAmi: 30, householdSize: 3, income: 43000 },
          { percentOfAmi: 50, householdSize: 1, income: 45000 },
          { percentOfAmi: 50, householdSize: 2, income: 46000 },
          { percentOfAmi: 50, householdSize: 3, income: 47000 },
          { percentOfAmi: 80, householdSize: 1, income: 48000 },
          { percentOfAmi: 80, householdSize: 2, income: 49000 },
          { percentOfAmi: 80, householdSize: 3, income: 50000 },
        ],
      };

      const result = getHouseholdMaxIncomeSummary(unitGroups, [
        amiChart1,
        amiChart2,
      ]);

      expect(result.columns).toEqual({
        householdSize: 'householdSize',
        percentage30: 30,
        percentage50: 50,
        percentage80: 80,
      });

      expect(result.rows).toHaveLength(3);

      expect(result.rows[0]).toEqual({
        householdSize: '1',
        percentage30: '$31,000 - $41,000',
        percentage50: '$35,000 - $45,000',
        percentage80: '$38,000 - $48,000',
      });

      expect(result.rows[1]).toEqual({
        householdSize: '2',
        percentage30: '$32,000 - $42,000',
        percentage50: '$36,000 - $46,000',
        percentage80: '$39,000 - $49,000',
      });

      expect(result.rows[2]).toEqual({
        householdSize: '3',
        percentage30: '$33,000 - $43,000',
        percentage50: '$37,000 - $47,000',
        percentage80: '$40,000 - $50,000',
      });
    });

    it('should correctly handle multiple AMI charts with different percentages', () => {
      const unitGroups: UnitGroup[] = [
        {
          ...defaultValues,
          id: 'group1',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type1',
              name: UnitTypeEnum.studio,
              numBedrooms: 0,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 30,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 1000,
            },
            {
              ...defaultValues,
              id: 'level2',
              amiPercentage: 40,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 1200,
            },
            {
              ...defaultValues,
              id: 'level3',
              amiPercentage: 60,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 1800,
            },
          ],
          minOccupancy: 1,
          maxOccupancy: 2,
        },
      ];

      // Create two AMI charts with different percentages
      const amiChart1 = {
        ...defaultValues,
        id: 'ami1',
        name: 'AMI Chart 1',
        jurisdictions: {
          id: 'jurisdiction1',
        },
        items: [
          { percentOfAmi: 30, householdSize: 1, income: 31000 },
          { percentOfAmi: 30, householdSize: 2, income: 32000 },
          { percentOfAmi: 40, householdSize: 1, income: 34000 },
          { percentOfAmi: 40, householdSize: 2, income: 35000 },
        ],
      };

      const amiChart2 = {
        ...defaultValues,
        id: 'ami2',
        name: 'AMI Chart 2',
        jurisdictions: {
          id: 'jurisdiction1',
        },
        items: [
          { percentOfAmi: 40, householdSize: 1, income: 36000 },
          { percentOfAmi: 40, householdSize: 2, income: 37000 },
          { percentOfAmi: 60, householdSize: 1, income: 38000 },
          { percentOfAmi: 60, householdSize: 2, income: 39000 },
        ],
      };

      const result = getHouseholdMaxIncomeSummary(unitGroups, [
        amiChart1,
        amiChart2,
      ]);

      expect(result.columns).toEqual({
        householdSize: 'householdSize',
        percentage30: 30,
        percentage40: 40,
        percentage60: 60,
      });

      expect(result.rows).toHaveLength(2);

      expect(result.rows[0]).toEqual({
        householdSize: '1',
        percentage30: '$31,000',
        percentage40: '$34,000 - $36,000',
        percentage60: '$38,000',
      });

      expect(result.rows[1]).toEqual({
        householdSize: '2',
        percentage30: '$32,000',
        percentage40: '$35,000 - $37,000',
        percentage60: '$39,000',
      });
    });

    it('should handle AMI charts with overlapping percentages but different incomes', () => {
      const unitGroups: UnitGroup[] = [
        {
          ...defaultValues,
          id: 'group1',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type1',
              name: UnitTypeEnum.studio,
              numBedrooms: 0,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 30,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 1000,
            },
          ],
          minOccupancy: 1,
          maxOccupancy: 2,
        },
      ];

      // Create charts with same percentages but different incomes
      const items1 = [
        { percentOfAmi: 30, householdSize: 1, income: 30000 },
        { percentOfAmi: 30, householdSize: 2, income: 35000 }, // Higher for size 2
      ];

      const items2 = [
        { percentOfAmi: 30, householdSize: 1, income: 32000 }, // Higher for size 1
        { percentOfAmi: 30, householdSize: 2, income: 34000 },
      ];

      const amiChart1 = {
        ...defaultValues,
        id: '1',
        name: 'AMI Chart 1',
        jurisdictions: { id: 'jurisdiction1' },
        items: items1,
      };

      const amiChart2 = {
        ...defaultValues,
        id: '2',
        name: 'AMI Chart 2',
        jurisdictions: { id: 'jurisdiction1' },
        items: items2,
      };

      const result = getHouseholdMaxIncomeSummary(unitGroups, [
        amiChart1,
        amiChart2,
      ]);

      expect(result.columns).toEqual({
        householdSize: 'householdSize',
        percentage30: 30,
      });

      expect(result.rows).toHaveLength(2); // For household sizes 1 and 2

      // Should create a range from both charts
      expect(result.rows[0]).toEqual({
        householdSize: '1',
        percentage30: '$30,000 - $32,000',
      });

      expect(result.rows[1]).toEqual({
        householdSize: '2',
        percentage30: '$34,000 - $35,000',
      });
    });
  });

  describe('summarizeUnitGroups', () => {
    it('should return empty data when no unit groups are provided', () => {
      const result = summarizeUnitGroups([], []);
      expect(result).toEqual({});
    });

    it('should correctly summarize unit groups and household max income', () => {
      // Create a simple unit group
      const unitGroups: UnitGroup[] = [
        {
          ...defaultValues,
          id: 'group1',
          unitTypes: [
            {
              ...defaultValues,
              id: 'type1',
              name: UnitTypeEnum.studio,
              numBedrooms: 0,
            },
          ],
          unitGroupAmiLevels: [
            {
              ...defaultValues,
              id: 'level1',
              amiPercentage: 30,
              monthlyRentDeterminationType:
                MonthlyRentDeterminationTypeEnum.flatRent,
              flatRentValue: 1000,
            },
          ],
          openWaitlist: true,
          totalAvailable: 5,
          bathroomMin: 1,
          bathroomMax: 1,
          floorMin: 1,
          floorMax: 1,
          sqFeetMin: 500,
          sqFeetMax: 500,
          minOccupancy: 1,
          maxOccupancy: 2,
        },
      ];

      // Create a simple AMI chart
      const amiChart = {
        ...defaultValues,
        id: 'ami1',
        name: 'AMI Chart 1',
        jurisdictions: {
          id: 'jurisdiction1',
        },
        items: [
          {
            percentOfAmi: 30,
            householdSize: 1,
            income: 31000,
          },
          {
            percentOfAmi: 30,
            householdSize: 2,
            income: 32000,
          },
        ],
      };

      // Call the function
      const result = summarizeUnitGroups(unitGroups, [amiChart]);

      // Check that it combines both summaries correctly
      expect(result).toHaveProperty('unitGroupSummary');
      expect(result).toHaveProperty('householdMaxIncomeSummary');

      // Check unit group summary
      expect(result.unitGroupSummary).toHaveLength(1);
      expect(result.unitGroupSummary[0].unitTypes).toEqual([
        {
          id: 'type1',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          name: UnitTypeEnum.studio,
          numBedrooms: 0,
        },
      ]);

      // Check household max income summary
      expect(result.householdMaxIncomeSummary.columns).toEqual({
        householdSize: 'householdSize',
        percentage30: 30,
      });
      expect(result.householdMaxIncomeSummary.rows).toHaveLength(2);
    });

    it('should currently summarize unit groups for non-regulated listing', () => {
      const unitGroups: UnitGroup[] = [
        {
          id: 'e8ebae55-103d-4a38-ab57-a4d974a11075',
          createdAt: new Date(),
          updatedAt: new Date(),
          maxOccupancy: 2,
          minOccupancy: 1,
          flatRentValueFrom: null,
          flatRentValueTo: null,
          monthlyRent: 3000,
          floorMin: null,
          floorMax: null,
          totalCount: 4,
          totalAvailable: 3,
          bathroomMin: 1,
          bathroomMax: 1,
          openWaitlist: false,
          sqFeetMin: null,
          sqFeetMax: null,
          rentType: 'fixedRent',
          unitGroupAmiLevels: [],
          unitTypes: [
            {
              id: 'f70e3cfe-80d3-4e9c-88e0-0b8e4c587b17',
              createdAt: new Date(),
              updatedAt: new Date(),
              name: 'studio',
              numBedrooms: 0,
            },
          ],
        },
        {
          id: '2d758f88-eadb-4cc6-ab01-912955455b22',
          createdAt: new Date(),
          updatedAt: new Date(),
          maxOccupancy: 4,
          minOccupancy: 2,
          flatRentValueFrom: 1500,
          flatRentValueTo: 2200,
          monthlyRent: null,
          floorMin: null,
          floorMax: null,
          totalCount: 3,
          totalAvailable: 2,
          bathroomMin: 1,
          bathroomMax: 2,
          openWaitlist: false,
          sqFeetMin: null,
          sqFeetMax: null,
          rentType: 'rentRange',
          unitGroupAmiLevels: [],
          unitTypes: [
            {
              id: 'ccc0dc7c-2e2b-4ed7-b7ec-a74a7d48d373',
              createdAt: new Date(),
              updatedAt: new Date(),
              name: 'twoBdrm',
              numBedrooms: 2,
            },
            {
              id: '1e371562-572a-4de2-9734-065608be1073',
              createdAt: new Date(),
              updatedAt: new Date(),
              name: 'fourBdrm',
              numBedrooms: 4,
            },
          ],
        },
      ];

      const result = summarizeUnitGroups(unitGroups, [], true);

      expect(result).toHaveProperty('unitGroupSummary');
      expect(result).toHaveProperty('householdMaxIncomeSummary');

      expect(result.unitGroupSummary).toHaveLength(2);
      const testUnitType = result.unitGroupSummary;
      expect(testUnitType[0]).toEqual(
        expect.objectContaining({
          unitTypes: expect.arrayContaining([
            expect.objectContaining({
              name: 'studio',
              numBedrooms: 0,
            }),
          ]),
          rentRange: {
            min: '$3000',
            max: '$3000',
          },
          openWaitlist: false,
          unitVacancies: 3,
          bathroomRange: {
            min: 1,
            max: 1,
          },
          floorRange: {
            min: null,
            max: null,
          },
          sqFeetRange: {
            min: null,
            max: null,
          },
        }),
      );

      expect(testUnitType[1]).toEqual(
        expect.objectContaining({
          unitTypes: expect.arrayContaining([
            expect.objectContaining({
              name: 'twoBdrm',
              numBedrooms: 2,
            }),
            expect.objectContaining({
              name: 'fourBdrm',
              numBedrooms: 4,
            }),
          ]),
          openWaitlist: false,
          unitVacancies: 2,
          bathroomRange: {
            min: 1,
            max: 2,
          },
          floorRange: {
            min: null,
            max: null,
          },
          sqFeetRange: {
            min: null,
            max: null,
          },
        }),
      );

      expect(result.householdMaxIncomeSummary).toMatchObject({
        columns: {
          householdSize: 'householdSize',
        },
        rows: [],
      });
    });
  });
});
