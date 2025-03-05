import { AmiChart } from '../../../src/dtos/ami-charts/ami-chart.dto';
import { MinMax } from '../../../src/dtos/shared/min-max.dto';
import { UnitGroup } from '../../../src/dtos/unit-groups/unit-group.dto';
import { MonthlyRentDeterminationTypeEnum, UnitTypeEnum } from '@prisma/client';
import {
  setMinMax,
  getUnitGroupSummary,
  getHouseholdMaxIncomeSummary,
  summarizeUnitGroups,
  getMaxIncomeAmiChartItems,
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
        unitTypes: [UnitTypeEnum.studio],
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
        unitTypes: [UnitTypeEnum.oneBdrm],
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
      // Check that unit groups are sorted by bedroom count
      expect(result[0].unitTypes).toEqual([UnitTypeEnum.studio]);
      expect(result[1].unitTypes).toEqual([UnitTypeEnum.oneBdrm]);
      // Check the second unit group with mixed rent types
      expect(result[1]).toEqual({
        unitTypes: [UnitTypeEnum.oneBdrm],
        rentAsPercentIncomeRange: {
          min: 30,
          max: 30,
        },
        rentRange: {
          min: '$1500',
          max: '$1500',
        },
        amiPercentageRange: {
          min: 50,
          max: 80,
        },
        openWaitlist: false,
        unitVacancies: 3,
        bathroomRange: {
          min: 1,
          max: 2,
        },
        floorRange: {
          min: 2,
          max: 4,
        },
        sqFeetRange: {
          min: 700,
          max: 900,
        },
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

      expect(result.rows).toHaveLength(3); // For household sizes 1, 2, and 3

      // Check household size 1
      expect(result.rows[0]).toEqual({
        householdSize: '1',
        percentage30: 31000 + 3000, // baseAmount + (1000 * size) + (percentage * 100)
        percentage50: 31000 + 5000,
      });

      // Check household size 2
      expect(result.rows[1]).toEqual({
        householdSize: '2',
        percentage30: 32000 + 3000,
        percentage50: 32000 + 5000,
      });

      // Check household size 3
      expect(result.rows[2]).toEqual({
        householdSize: '3',
        percentage30: 33000 + 3000,
        percentage50: 33000 + 5000,
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

      expect(result.rows).toHaveLength(3); // For household sizes 1, 2, and 3

      // Check that it uses the higher income values from amiChart2
      // Check household size 1
      expect(result.rows[0]).toEqual({
        householdSize: '1',
        percentage30: 41000,
        percentage50: 45000,
        percentage80: 48000,
      });

      // Check household size 2
      expect(result.rows[1]).toEqual({
        householdSize: '2',
        percentage30: 42000,
        percentage50: 46000,
        percentage80: 49000,
      });

      // Check household size 3
      expect(result.rows[2]).toEqual({
        householdSize: '3',
        percentage30: 43000,
        percentage50: 47000,
        percentage80: 50000,
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

      expect(result.rows).toHaveLength(2); // For household sizes 1 and 2

      // Check household size 1
      expect(result.rows[0]).toEqual({
        householdSize: '1',
        percentage30: 31000, // From amiChart1
        percentage40: 36000, // From amiChart2 (higher value)
        percentage60: 38000, // From amiChart2
      });

      // Check household size 2
      expect(result.rows[1]).toEqual({
        householdSize: '2',
        percentage30: 32000, // From amiChart1
        percentage40: 37000, // From amiChart2 (higher value)
        percentage60: 39000, // From amiChart2
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

      // Should pick the higher income for each household size
      expect(result.rows[0]).toEqual({
        householdSize: '1',
        percentage30: 32000, // Higher value from amiChart2
      });

      expect(result.rows[1]).toEqual({
        householdSize: '2',
        percentage30: 35000, // Higher value from amiChart1
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
        UnitTypeEnum.studio,
      ]);

      // Check household max income summary
      expect(result.householdMaxIncomeSummary.columns).toEqual({
        householdSize: 'householdSize',
        percentage30: 30,
      });
      expect(result.householdMaxIncomeSummary.rows).toHaveLength(2);
    });
  });

  describe('getMaxIncomeAmiChartItems', () => {
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

    const generateAmiChart = (
      id: string,
      percentages: number[],
      baseAmount: number,
    ): AmiChart => {
      return {
        ...defaultValues,
        id,
        name: `AMI Chart ${id}`,
        jurisdictions: {
          id: 'jurisdiction1',
        },
        items: generateAmiChartItems(8, percentages, baseAmount),
      };
    };

    it('should return empty array for empty input', () => {
      expect(getMaxIncomeAmiChartItems([])).toEqual([]);
      expect(getMaxIncomeAmiChartItems(null)).toEqual([]);
    });

    it('should return items from a single AMI chart', () => {
      const amiChart = generateAmiChart('1', [30, 50], 30000);
      const result = getMaxIncomeAmiChartItems([amiChart]);

      // Should have 16 items (8 household sizes * 2 percentages)
      expect(result).toHaveLength(16);

      // Check a few sample items
      expect(result).toContainEqual({
        percentOfAmi: 30,
        householdSize: 1,
        income: 31000 + 3000, // baseAmount + (1000 * size) + (percentage * 100)
      });

      expect(result).toContainEqual({
        percentOfAmi: 50,
        householdSize: 2,
        income: 32000 + 5000,
      });
    });

    it('should return maximum income values from multiple AMI charts', () => {
      // Create two AMI charts with different base amounts
      const amiChart1 = generateAmiChart('1', [30, 50], 30000);
      const amiChart2 = generateAmiChart('2', [30, 50], 35000);

      const result = getMaxIncomeAmiChartItems([amiChart1, amiChart2]);

      // Should still have 16 items (8 household sizes * 2 percentages)
      expect(result).toHaveLength(16);

      // Check that it picked the higher income values from amiChart2
      expect(result).toContainEqual({
        percentOfAmi: 30,
        householdSize: 1,
        income: 36000 + 3000, // baseAmount + (1000 * size) + (percentage * 100)
      });

      expect(result).toContainEqual({
        percentOfAmi: 50,
        householdSize: 2,
        income: 37000 + 5000,
      });

      // Make sure no values from amiChart1 are present (since all values in amiChart2 are higher)
      expect(result).not.toContainEqual({
        percentOfAmi: 30,
        householdSize: 1,
        income: 31000 + 3000,
      });
    });

    it('should handle charts with different percentages and household sizes', () => {
      // Create two AMI charts with different percentages
      const amiChart1 = generateAmiChart('1', [30, 40], 30000);
      const amiChart2 = generateAmiChart('2', [50, 60], 35000);

      const result = getMaxIncomeAmiChartItems([amiChart1, amiChart2]);

      // Should have 32 items (8 household sizes * 4 percentages)
      expect(result).toHaveLength(32);

      // Check values from amiChart1
      expect(result).toContainEqual({
        percentOfAmi: 30,
        householdSize: 1,
        income: 31000 + 3000,
      });

      // Check values from amiChart2
      expect(result).toContainEqual({
        percentOfAmi: 50,
        householdSize: 1,
        income: 36000 + 5000,
      });
    });

    it('should handle charts with overlapping percentages but different incomes', () => {
      // Create charts with same percentages but different incomes
      const items1 = [
        { percentOfAmi: 30, householdSize: 1, income: 30000 },
        { percentOfAmi: 30, householdSize: 2, income: 35000 },
      ];

      const items2 = [
        { percentOfAmi: 30, householdSize: 1, income: 32000 }, // Higher
        { percentOfAmi: 30, householdSize: 2, income: 34000 }, // Lower
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

      const result = getMaxIncomeAmiChartItems([amiChart1, amiChart2]);

      // Should have 2 items with the maximum values
      expect(result).toHaveLength(2);

      // Should pick the higher income for household size 1
      expect(result).toContainEqual({
        percentOfAmi: 30,
        householdSize: 1,
        income: 32000,
      });

      // Should pick the higher income for household size 2
      expect(result).toContainEqual({
        percentOfAmi: 30,
        householdSize: 2,
        income: 35000,
      });
    });
  });
});
