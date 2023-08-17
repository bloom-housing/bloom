import { AmiChart } from '../../../src/dtos/ami-charts/ami-chart.dto';
import { UnitAmiChartOverride } from '../../../src/dtos/units/ami-chart-override.dto';
import {
  generateHmiData,
  mergeAmiChartWithOverrides,
} from '../../../src/utilities/unit-utilities';
import { Unit } from '../../../src/dtos/units/unit.dto';
import { AmiChartItem } from '../../../src/dtos/units/ami-chart-item.dto';

const defaultValues = {
  createdAt: new Date(),
  updatedAt: new Date(),
};

const unit: Unit = {
  ...defaultValues,
  amiPercentage: '30',
  maxOccupancy: 2,
  amiChart: {
    id: 'ami1',
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
    name: 'ami1',
    jurisdictions: {
      id: 'id',
    },
  },
  id: 'example',
};

const generateAmiChartItems = (
  maxHousehold: number,
  percentage: number,
  baseAmount: number,
): AmiChartItem[] => {
  return [...Array(maxHousehold).keys()].map((value: number) => {
    return {
      percentOfAmi: percentage,
      householdSize: value + 1,
      income: baseAmount + 1000 * value,
    };
  });
};

const generateAmiChart = (): AmiChart => {
  return {
    ...defaultValues,
    id: 'ami1',
    name: 'ami1',
    jurisdictions: {
      id: 'id',
    },
    items: generateAmiChartItems(8, 30, 30_000),
  };
};

describe('Unit Transformations', () => {
  describe('mergeAmiChartWithOverrides', () => {
    it('Ami chart items are correctly overwritten', () => {
      const amiChartOverride: UnitAmiChartOverride = {
        id: 'id',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            percentOfAmi: 30,
            householdSize: 2,
            income: 20,
          },
        ],
      };
      const result = mergeAmiChartWithOverrides(
        generateAmiChart(),
        amiChartOverride,
      );
      expect(result.items.length).toBe(8);
      expect(result.items[0].income).toBe(30000);
      expect(result.items[1].income).toBe(20);
      expect(result.items[2].income).toBe(32000);
    });
  });

  describe('generateHmiData', () => {
    it('should generate HMI data for one unit and amiChart', () => {
      const result = generateHmiData(
        [unit],
        [{ min: 2, max: 5 }],
        [generateAmiChart()],
      );

      expect(result).toEqual({
        columns: {
          maxIncomeMonth: 'listings.maxIncomeMonth',
          maxIncomeYear: 'listings.maxIncomeYear',
          sizeColumn: 'listings.householdSize',
        },
        rows: [
          {
            maxIncomeMonth: 'listings.monthlyIncome*income:$2,583',
            maxIncomeYear: 'listings.annualIncome*income:$31,000',
            sizeColumn: 2,
          },
          {
            maxIncomeMonth: 'listings.monthlyIncome*income:$2,667',
            maxIncomeYear: 'listings.annualIncome*income:$32,000',
            sizeColumn: 3,
          },
          {
            maxIncomeMonth: 'listings.monthlyIncome*income:$2,750',
            maxIncomeYear: 'listings.annualIncome*income:$33,000',
            sizeColumn: 4,
          },
          {
            maxIncomeMonth: 'listings.monthlyIncome*income:$2,833',
            maxIncomeYear: 'listings.annualIncome*income:$34,000',
            sizeColumn: 5,
          },
        ],
      });
    });
    it('should only have the highest chart data if min household is larger', () => {
      const result = generateHmiData(
        [unit],
        [{ min: 9, max: 11 }],
        [generateAmiChart()],
      );

      expect(result).toEqual({
        columns: {
          maxIncomeMonth: 'listings.maxIncomeMonth',
          maxIncomeYear: 'listings.maxIncomeYear',
          sizeColumn: 'listings.householdSize',
        },
        rows: [
          {
            maxIncomeMonth: 'listings.monthlyIncome*income:$3,083',
            maxIncomeYear: 'listings.annualIncome*income:$37,000',
            sizeColumn: 8,
          },
        ],
      });
    });
    it('should generate for more than 1 unit and amiChart ', () => {
      const result = generateHmiData(
        [
          unit,
          {
            ...unit,
            amiPercentage: '40',
            amiChart: {
              id: 'ami2',
              createdAt: new Date(),
              updatedAt: new Date(),
              items: [],
              name: 'ami2',
              jurisdictions: {
                id: 'id',
              },
            },
          },
        ],
        [
          { min: 1, max: 3 },
          { min: 5, max: 7 },
        ],
        [
          generateAmiChart(),
          {
            ...generateAmiChart(),
            id: 'ami2',
            items: generateAmiChartItems(8, 40, 40_000),
          },
        ],
      );

      expect(result).toEqual({
        columns: {
          ami30: 'listings.percentAMIUnit*percent:30',
          ami40: 'listings.percentAMIUnit*percent:40',
          sizeColumn: 'listings.householdSize',
        },
        rows: [
          {
            ami30: 'listings.annualIncome*income:$30,000',
            ami40: 'listings.annualIncome*income:$40,000',
            sizeColumn: 1,
          },
          {
            ami30: 'listings.annualIncome*income:$31,000',
            ami40: 'listings.annualIncome*income:$41,000',
            sizeColumn: 2,
          },
          {
            ami30: 'listings.annualIncome*income:$32,000',
            ami40: 'listings.annualIncome*income:$42,000',
            sizeColumn: 3,
          },
          {
            ami30: 'listings.annualIncome*income:$34,000',
            ami40: 'listings.annualIncome*income:$44,000',
            sizeColumn: 5,
          },
          {
            ami30: 'listings.annualIncome*income:$35,000',
            ami40: 'listings.annualIncome*income:$45,000',
            sizeColumn: 6,
          },
          {
            ami30: 'listings.annualIncome*income:$36,000',
            ami40: 'listings.annualIncome*income:$46,000',
            sizeColumn: 7,
          },
        ],
      });
    });
    it('should have bmr values', () => {
      const result = generateHmiData(
        [
          {
            ...unit,
            bmrProgramChart: true,
            unitTypes: {
              ...defaultValues,
              id: 'oneBed',
              name: 'oneBdrm',
              numBedrooms: 1,
            },
          },
        ],
        [{ min: 1, max: 3 }],
        [generateAmiChart()],
      );

      expect(result).toEqual({
        columns: {
          maxIncomeMonth: 'listings.maxIncomeMonth',
          maxIncomeYear: 'listings.maxIncomeYear',
          sizeColumn: 't.unitType',
        },
        rows: [
          {
            maxIncomeMonth: 'listings.monthlyIncome*income:$2,583',
            maxIncomeYear: 'listings.annualIncome*income:$31,000',
            sizeColumn: 'listings.unitTypes.oneBdrm',
          },
        ],
      });
    });
  });
});
