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
  ): Promise<any> {
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
  ): Promise<any> {
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
