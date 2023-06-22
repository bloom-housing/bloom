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
      view?: ListingViews;
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
      view?: ListingViews;
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
      configs.params = { jurisdictionId: params['jurisdictionId'] };

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
      body?: AmiChartUpdate;
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
      jurisdictionId?: string;
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
      configs.params = { jurisdictionId: params['jurisdictionId'] };

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
      body?: ReservedCommunityTypeCreate;
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
      body?: ReservedCommunityTypeUpdate;
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
      body?: UnitTypeUpdate;
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

export interface ListingsQueryParams {
  /**  */
  page?: number;

  /**  */
  limit?: number | 'all';

  /**  */
  filter?: string[];

  /**  */
  view?: ListingViews;

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
  view?: ListingViews;
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
  name: UnitTypeEnum;

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
  name?: string;
}

export interface AmiChartCreate {
  /**  */
  items: AmiChartItem[];

  /**  */
  name: string;

  /**  */
  jurisdictions: IdDTO;
}

export interface AmiChartUpdate {
  /**  */
  id: string;

  /**  */
  items: AmiChartItem[];

  /**  */
  name: string;
}

export interface AmiChartQueryParams {
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

export interface ReservedCommunityTypeCreate {
  /**  */
  name: string;

  /**  */
  description: string;

  /**  */
  jurisdictions: IdDTO;
}

export interface ReservedCommunityTypeUpdate {
  /**  */
  id: string;

  /**  */
  name: string;

  /**  */
  description: string;
}

export interface ReservedCommunityTypeQueryParams {
  /**  */
  jurisdictionId?: string;
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
  name: UnitTypeEnum;

  /**  */
  numBedrooms: number;
}

export interface UnitTypeUpdate {
  /**  */
  id: string;

  /**  */
  name: UnitTypeEnum;

  /**  */
  numBedrooms: number;
}

export enum ListingViews {
  'fundamentals' = 'fundamentals',
  'base' = 'base',
  'full' = 'full',
  'details' = 'details',
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

export enum UnitTypeEnum {
  'studio' = 'studio',
  'oneBdrm' = 'oneBdrm',
  'twoBdrm' = 'twoBdrm',
  'threeBdrm' = 'threeBdrm',
  'fourBdrm' = 'fourBdrm',
  'SRO' = 'SRO',
  'fiveBdrm' = 'fiveBdrm',
}
