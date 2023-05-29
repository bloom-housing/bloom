/** Generate by swagger-axios-codegen */
// @ts-nocheck
/* eslint-disable */

/** Generate by swagger-axios-codegen */
/* eslint-disable */
// @ts-nocheck
import axiosStatic, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface IRequestOptions extends AxiosRequestConfig {
  /** only in axios interceptor config*/
  loading?: boolean;
  showError?: boolean;
}

export interface IRequestConfig {
  method?: any;
  headers?: any;
  url?: any;
  data?: any;
  params?: any;
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance;
  /** only in axios interceptor config*/
  loading: boolean;
  showError: boolean;
}

// Add default options
export const serviceOptions: ServiceOptions = {};

// Instance selector
export function axios(
  configs: IRequestConfig,
  resolve: (p: any) => void,
  reject: (p: any) => void,
): Promise<any> {
  if (serviceOptions.axios) {
    return serviceOptions.axios
      .request(configs)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  } else {
    throw new Error('please inject yourself instance like axios  ');
  }
}

export function getConfigs(
  method: string,
  contentType: string,
  url: string,
  options: any,
): IRequestConfig {
  const configs: IRequestConfig = {
    loading: serviceOptions.loading,
    showError: serviceOptions.showError,
    ...options,
    method,
    url,
  };
  configs.headers = {
    ...options.headers,
    'Content-Type': contentType,
  };
  return configs;
}

export const basePath = '';

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue;
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[];
}

export class ListResult<T> implements IListResult<T> {
  items?: T[];
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount?: number;
  items?: T[];
}

export class PagedResult<T = any> implements IPagedResult<T> {
  totalCount?: number;
  items?: T[];
}

// customer definition
// empty

export class ListingsService {
  /**
   * Get a paginated set of listings
   */
  list(
    params: {
      /**  */
      page?: number;
      /**  */
      limit?: number | 'all';
      /**  */
      filter?: ListingFilterParams[];
      /**  */
      view?: string;
      /**  */
      orderBy?: any | null[];
      /**  */
      orderDir?: any | null[];
      /**  */
      search?: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<PaginatedListing> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/listings';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );
      configs.params = {
        page: params['page'],
        limit: params['limit'],
        filter: params['filter'],
        view: params['view'],
        orderBy: params['orderBy'],
        orderDir: params['orderDir'],
        search: params['search'],
      };

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Get listing by id
   */
  retrieve(
    params: {
      /**  */
      id: string;
      /**  */
      view?: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<ListingGet> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/listings/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );
      configs.params = { view: params['view'] };

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
}

export class AmiChartsService {
  /**
   * List amiCharts
   */
  list(
    params: {
      /**  */
      jurisdictionName?: string;
      /**  */
      jurisdictionId?: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<AmiChart[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/amiCharts';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );
      configs.params = {
        jurisdictionName: params['jurisdictionName'],
        jurisdictionId: params['jurisdictionId'],
      };

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Create amiChart
   */
  create(
    params: {
      /** requestBody */
      body?: AmiChartCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<AmiChart> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/amiCharts';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete amiChart by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/amiCharts';

      const configs: IRequestConfig = getConfigs(
        'delete',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * Get amiChart by id
   */
  retrieve(
    params: {
      /**  */
      amiChartId: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<AmiChart> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/amiCharts/{amiChartId}';
      url = url.replace('{amiChartId}', params['amiChartId'] + '');

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Update amiChart
   */
  update(
    params: {
      /** requestBody */
      body?: AmiChart;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<AmiChart> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/amiCharts/{amiChartId}';

      const configs: IRequestConfig = getConfigs(
        'put',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class ReservedCommunityTypesService {
  /**
   * List reservedCommunityTypes
   */
  list(
    params: {
      /**  */
      jurisdictionName?: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<ReservedCommunityType[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/reservedCommunityTypes';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );
      configs.params = { jurisdictionName: params['jurisdictionName'] };

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Create reservedCommunityType
   */
  create(
    params: {
      /** requestBody */
      body?: ReservedCommunitTypeCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<ReservedCommunityType> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/reservedCommunityTypes';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete reservedCommunityType by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/reservedCommunityTypes';

      const configs: IRequestConfig = getConfigs(
        'delete',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * Get reservedCommunityType by id
   */
  retrieve(
    params: {
      /**  */
      reservedCommunityTypeId: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<ReservedCommunityType> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/reservedCommunityTypes/{reservedCommunityTypeId}';
      url = url.replace(
        '{reservedCommunityTypeId}',
        params['reservedCommunityTypeId'] + '',
      );

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Update reservedCommunityType
   */
  update(
    params: {
      /** requestBody */
      body?: ReservedCommunityType;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<ReservedCommunityType> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/reservedCommunityTypes/{reservedCommunityTypeId}';

      const configs: IRequestConfig = getConfigs(
        'put',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class UnitTypesService {
  /**
   * List unitTypes
   */
  list(options: IRequestOptions = {}): Promise<UnitType[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/unitTypes';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Create unitType
   */
  create(
    params: {
      /** requestBody */
      body?: UnitTypeCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<UnitType> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/unitTypes';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete unitType by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/unitTypes';

      const configs: IRequestConfig = getConfigs(
        'delete',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * Get unitType by id
   */
  retrieve(
    params: {
      /**  */
      unitTypeId: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<UnitType> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/unitTypes/{unitTypeId}';
      url = url.replace('{unitTypeId}', params['unitTypeId'] + '');

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Update unitType
   */
  update(
    params: {
      /** requestBody */
      body?: UnitType;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<UnitType> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/unitTypes/{unitTypeId}';

      const configs: IRequestConfig = getConfigs(
        'put',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class UnitAccessibilityPriorityTypesService {
  /**
   * List unitAccessibilityPriorityTypes
   */
  list(
    options: IRequestOptions = {},
  ): Promise<UnitAccessibilityPriorityType[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/unitAccessibilityPriorityTypes';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Create unitAccessibilityPriorityType
   */
  create(
    params: {
      /** requestBody */
      body?: UnitAccessibilityPriorityTypeCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<UnitAccessibilityPriorityType> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/unitAccessibilityPriorityTypes';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete unitAccessibilityPriorityType by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/unitAccessibilityPriorityTypes';

      const configs: IRequestConfig = getConfigs(
        'delete',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * Get unitAccessibilityPriorityType by id
   */
  retrieve(
    params: {
      /**  */
      unitAccessibilityPriorityTypeId: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<UnitAccessibilityPriorityType> {
    return new Promise((resolve, reject) => {
      let url =
        basePath +
        '/unitAccessibilityPriorityTypes/{unitAccessibilityPriorityTypeId}';
      url = url.replace(
        '{unitAccessibilityPriorityTypeId}',
        params['unitAccessibilityPriorityTypeId'] + '',
      );

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Update unitAccessibilityPriorityType
   */
  update(
    params: {
      /** requestBody */
      body?: UnitAccessibilityPriorityType;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<UnitAccessibilityPriorityType> {
    return new Promise((resolve, reject) => {
      let url =
        basePath +
        '/unitAccessibilityPriorityTypes/{unitAccessibilityPriorityTypeId}';

      const configs: IRequestConfig = getConfigs(
        'put',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class UnitRentTypesService {
  /**
   * List unitRentTypes
   */
  list(options: IRequestOptions = {}): Promise<UnitRentType[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/unitRentTypes';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Create unitRentType
   */
  create(
    params: {
      /** requestBody */
      body?: UnitRentTypeCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<UnitRentType> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/unitRentTypes';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete unitRentType by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/unitRentTypes';

      const configs: IRequestConfig = getConfigs(
        'delete',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * Get unitRentType by id
   */
  retrieve(
    params: {
      /**  */
      unitRentTypeId: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<UnitRentType> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/unitRentTypes/{unitRentTypeId}';
      url = url.replace('{unitRentTypeId}', params['unitRentTypeId'] + '');

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Update unitRentType
   */
  update(
    params: {
      /** requestBody */
      body?: UnitRentType;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<UnitRentType> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/unitRentTypes/{unitRentTypeId}';

      const configs: IRequestConfig = getConfigs(
        'put',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export class PaperApplicationsService {
  /**
   * List paperApplications
   */
  list(options: IRequestOptions = {}): Promise<PaperApplication[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/paperApplications';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Create paperApplication
   */
  create(
    params: {
      /** requestBody */
      body?: PaperApplicationCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<PaperApplication> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/paperApplications';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete paperApplication by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/paperApplications';

      const configs: IRequestConfig = getConfigs(
        'delete',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * Get paperApplication by id
   */
  retrieve(
    params: {
      /**  */
      paperApplicationId: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<PaperApplication> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/paperApplications/{paperApplicationId}';
      url = url.replace(
        '{paperApplicationId}',
        params['paperApplicationId'] + '',
      );

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Update paperApplication
   */
  update(
    params: {
      /** requestBody */
      body?: PaperApplicationCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<PaperApplication> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/paperApplications/{paperApplicationId}';

      const configs: IRequestConfig = getConfigs(
        'put',
        'application/json',
        url,
        options,
      );

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}

export interface ListingsQueryParams {
  /**  */
  page?: number;

  /**  */
  limit?: number | 'all';

  /**  */
  filter?: string[];

  /**  */
  view?: string;

  /**  */
  orderBy?: [];

  /**  */
  orderDir?: EnumListingsQueryParamsOrderDir[];

  /**  */
  search?: string;
}

export interface ListingFilterParams {
  /**  */
  $comparison: EnumListingFilterParamsComparison;

  /**  */
  name?: string;

  /**  */
  status?: EnumListingFilterParamsStatus;

  /**  */
  neighborhood?: string;

  /**  */
  bedrooms?: number;

  /**  */
  zipcode?: string;

  /**  */
  leasingAgents?: string;

  /**  */
  jurisdiction?: string;
}

export interface ListingsRetrieveParams {
  /**  */
  view?: string;
}

export interface PaginationAllowsAllQueryParams {
  /**  */
  page?: number;

  /**  */
  limit?: number | 'all';
}

export interface ApplicationMethod {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  type: ApplicationMethodsTypeEnum;
}

export interface UnitType {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  name: string;

  /**  */
  numBedrooms: number;
}

export interface UnitAccessibilityPriorityType {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  name: string;
}

export interface MinMaxCurrency {
  /**  */
  min: string;

  /**  */
  max: string;
}

export interface MinMax {
  /**  */
  min: number;

  /**  */
  max: number;
}

export interface UnitSummary {
  /**  */
  unitTypes: UnitType;

  /**  */
  minIncomeRange: MinMaxCurrency;

  /**  */
  occupancyRange: MinMax;

  /**  */
  rentAsPercentIncomeRange: MinMax;

  /**  */
  rentRange: MinMaxCurrency;

  /**  */
  totalAvailable: number;

  /**  */
  areaRange: MinMax;

  /**  */
  floorRange?: MinMax;
}

export interface UnitSummaryByAMI {
  /**  */
  percent: string;

  /**  */
  byUnitType: UnitSummary[];
}

export interface HMI {
  /**  */
  columns: object;

  /**  */
  rows: object[];
}

export interface UnitsSummarized {
  /**  */
  unitTypes: UnitType[];

  /**  */
  priorityTypes: UnitAccessibilityPriorityType[];

  /**  */
  amiPercentages: string[];

  /**  */
  byUnitTypeAndRent: UnitSummary[];

  /**  */
  byUnitType: UnitSummary[];

  /**  */
  byAMI: UnitSummaryByAMI[];

  /**  */
  hmi: HMI;
}

export interface ListingGet {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  applicationPickUpAddressType: ApplicationAddressTypeEnum;

  /**  */
  applicationDropOffAddressType: ApplicationAddressTypeEnum;

  /**  */
  applicationMailingAddressType: ApplicationAddressTypeEnum;

  /**  */
  status: ListingsStatusEnum;

  /**  */
  reviewOrderType: ReviewOrderTypeEnum;

  /**  */
  showWaitlist: boolean;

  /**  */
  referralApplication?: ApplicationMethod;

  /**  */
  unitsSummarized: UnitsSummarized;
}

export interface PaginatedListing {
  /**  */
  items: ListingGet[];
}

export interface AmiChartItem {
  /**  */
  percentOfAmi: number;

  /**  */
  householdSize: number;

  /**  */
  income: number;
}

export interface IdDTO {
  /**  */
  id: string;

  /**  */
  name: string;
}

export interface AmiChartCreate {
  /**  */
  items: AmiChartItem[];

  /**  */
  name: string;

  /**  */
  jurisdictions: IdDTO;
}

export interface AmiChartQueryParams {
  /**  */
  jurisdictionName?: string;

  /**  */
  jurisdictionId?: string;
}

export interface AmiChart {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  items: AmiChartItem[];

  /**  */
  name: string;

  /**  */
  jurisdictions: IdDTO;
}

export interface SuccessDTO {
  /**  */
  success: boolean;
}

export interface ReservedCommunitTypeCreate {
  /**  */
  name: string;

  /**  */
  description: string;

  /**  */
  jurisdictions: IdDTO;
}

export interface ReservedCommunityTypeQueryParams {
  /**  */
  jurisdictionName?: string;
}

export interface ReservedCommunityType {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  name: string;

  /**  */
  description: string;

  /**  */
  jurisdictions: IdDTO;
}

export interface UnitTypeCreate {
  /**  */
  name: string;

  /**  */
  numBedrooms: number;
}

export interface UnitAccessibilityPriorityTypeCreate {
  /**  */
  name: string;
}

export interface UnitRentTypeCreate {
  /**  */
  name: string;
}

export interface UnitRentType {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  name: string;
}

export interface AssetCreate {
  /**  */
  fileId: string;

  /**  */
  label: string;
}

export interface PaperApplicationCreate {
  /**  */
  language: EnumPaperApplicationCreateLanguage;

  /**  */
  id: string;

  /**  */
  assets: AssetCreate;
}

export interface Asset {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  fileId: string;

  /**  */
  label: string;
}

export interface PaperApplication {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  language: EnumPaperApplicationLanguage;

  /**  */
  assets: Asset;
}
export enum EnumListingsQueryParamsOrderDir {
  'asc' = 'asc',
  'desc' = 'desc',
}
export enum EnumListingFilterParamsComparison {
  '=' = '=',
  '<>' = '<>',
  'IN' = 'IN',
  '>=' = '>=',
  '<=' = '<=',
  'NA' = 'NA',
}
export enum EnumListingFilterParamsStatus {
  'active' = 'active',
  'pending' = 'pending',
  'closed' = 'closed',
}
export enum ApplicationAddressTypeEnum {
  'leasingAgent' = 'leasingAgent',
}

export enum ListingsStatusEnum {
  'active' = 'active',
  'pending' = 'pending',
  'closed' = 'closed',
}

export enum ReviewOrderTypeEnum {
  'lottery' = 'lottery',
  'firstComeFirstServe' = 'firstComeFirstServe',
  'waitlist' = 'waitlist',
}

export enum ApplicationMethodsTypeEnum {
  'Internal' = 'Internal',
  'FileDownload' = 'FileDownload',
  'ExternalLink' = 'ExternalLink',
  'PaperPickup' = 'PaperPickup',
  'POBox' = 'POBox',
  'LeasingAgent' = 'LeasingAgent',
  'Referral' = 'Referral',
}
export enum EnumPaperApplicationCreateLanguage {
  'en' = 'en',
  'es' = 'es',
  'vi' = 'vi',
  'zh' = 'zh',
  'tl' = 'tl',
}
export enum EnumPaperApplicationLanguage {
  'en' = 'en',
  'es' = 'es',
  'vi' = 'vi',
  'zh' = 'zh',
  'tl' = 'tl',
}
