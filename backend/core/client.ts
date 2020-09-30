/** Generate by swagger-axios-codegen */
// tslint:disable
/* eslint-disable */
import axiosStatic, { AxiosInstance } from 'axios';

const basePath = '';

export interface IRequestOptions {
  headers?: any;
  baseURL?: string;
  responseType?: string;
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
}

// Add default options
export const serviceOptions: ServiceOptions = {};

// Instance selector
export function axios(configs: IRequestConfig, resolve: (p: any) => void, reject: (p: any) => void): Promise<any> {
  if (serviceOptions.axios) {
    return serviceOptions.axios
      .request(configs)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  } else {
    throw new Error('please inject yourself instance like axios  ');
  }
}

export function getConfigs(method: string, contentType: string, url: string, options: any): IRequestConfig {
  url = basePath + url;
  const configs: IRequestConfig = { ...options, method, url };
  configs.headers = {
    ...options.headers,
    'Content-Type': contentType
  };
  return configs;
}

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue;
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[];
}

export class ListResultDto<T> implements IListResult<T> {
  items?: T[];
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount: number;
}

export class PagedResultDto<T> implements IPagedResult<T> {
  totalCount!: number;
}

// customer definition
// empty

export class AuthService {
  /**
   * Login
   */
  login(
    params: {
      /** requestBody */
      body?: LoginDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<LoginResponseDto> {
    return new Promise((resolve, reject) => {
      let url = '/auth/login';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Register
   */
  register(
    params: {
      /** requestBody */
      body?: CreateUserDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '/auth/register';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Token
   */
  token(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '/auth/token';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class ListingsService {
  /**
   * List listings
   */
  list(
    params: {
      /**  */
      jsonpath: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ListingExtendedDto> {
    return new Promise((resolve, reject) => {
      let url = '/listings';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { jsonpath: params['jsonpath'] };
      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create listing
   */
  create(
    params: {
      /** requestBody */
      body?: ListingCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Listing> {
    return new Promise((resolve, reject) => {
      let url = '/listings';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Get listing by id
   */
  retrieve(
    params: {
      /**  */
      listingId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Listing> {
    return new Promise((resolve, reject) => {
      let url = '/listings/{listingId}';
      url = url.replace('{listingId}', params['listingId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update listing by id
   */
  update(
    params: {
      /**  */
      listingId: string;
      /** requestBody */
      body?: ListingUpdateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Listing> {
    return new Promise((resolve, reject) => {
      let url = '/listings/{listingId}';
      url = url.replace('{listingId}', params['listingId'] + '');

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete listing by id
   */
  delete(
    params: {
      /**  */
      listingId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '/listings/{listingId}';
      url = url.replace('{listingId}', params['listingId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class ApplicationsService {
  /**
   * List applications
   */
  list(
    params: {
      /**  */
      listingId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationDto[]> {
    return new Promise((resolve, reject) => {
      let url = '/applications';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { listingId: params['listingId'] };
      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create application
   */
  create(
    params: {
      /** requestBody */
      body?: ApplicationCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationDto> {
    return new Promise((resolve, reject) => {
      let url = '/applications';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * List applications as csv
   */
  listAsCsv(
    params: {
      /**  */
      listingId: string;
      /**  */
      includeHeaders: boolean;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = '/applications/csv';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { listingId: params['listingId'], includeHeaders: params['includeHeaders'] };
      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Get application by id
   */
  retrieve(
    params: {
      /**  */
      applicationId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationDto> {
    return new Promise((resolve, reject) => {
      let url = '/applications/{applicationId}';
      url = url.replace('{applicationId}', params['applicationId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update application by id
   */
  update(
    params: {
      /**  */
      applicationId: string;
      /** requestBody */
      body?: ApplicationUpdateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationDto> {
    return new Promise((resolve, reject) => {
      let url = '/applications/{applicationId}';
      url = url.replace('{applicationId}', params['applicationId'] + '');

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete application by id
   */
  delete(
    params: {
      /**  */
      applicationId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '/applications/{applicationId}';
      url = url.replace('{applicationId}', params['applicationId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class AssetsService {
  /**
   * Retrieve one Asset
   */
  getOneBaseAssetsControllerAsset(
    params: {
      /**  */
      id: string;
      /** Selects resource fields. <a href="https://github.com/nestjsx/crud/wiki/Requests#select" target="_blank">Docs</a> */
      fields?: any | null[];
      /** Adds relational resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#join" target="_blank">Docs</a> */
      join?: any | null[];
      /** Reset cache (if was enabled). <a href="https://github.com/nestjsx/crud/wiki/Requests#cache" target="_blank">Docs</a> */
      cache?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Asset> {
    return new Promise((resolve, reject) => {
      let url = '/assets/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { fields: params['fields'], join: params['join'], cache: params['cache'] };
      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update one Asset
   */
  updateOneBaseAssetsControllerAsset(
    params: {
      /**  */
      id: string;
      /** requestBody */
      body?: Asset;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Asset> {
    return new Promise((resolve, reject) => {
      let url = '/assets/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('patch', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Replace one Asset
   */
  replaceOneBaseAssetsControllerAsset(
    params: {
      /**  */
      id: string;
      /** requestBody */
      body?: Asset;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Asset> {
    return new Promise((resolve, reject) => {
      let url = '/assets/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete one Asset
   */
  deleteOneBaseAssetsControllerAsset(
    params: {
      /**  */
      id: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '/assets/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Retrieve many Asset
   */
  getManyBaseAssetsControllerAsset(
    params: {
      /** Selects resource fields. <a href="https://github.com/nestjsx/crud/wiki/Requests#select" target="_blank">Docs</a> */
      fields?: any | null[];
      /** Adds search condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#search" target="_blank">Docs</a> */
      s?: string;
      /** Adds filter condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#filter" target="_blank">Docs</a> */
      filter?: any | null[];
      /** Adds OR condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#or" target="_blank">Docs</a> */
      or?: any | null[];
      /** Adds sort by field. <a href="https://github.com/nestjsx/crud/wiki/Requests#sort" target="_blank">Docs</a> */
      sort?: any | null[];
      /** Adds relational resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#join" target="_blank">Docs</a> */
      join?: any | null[];
      /** Limit amount of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#limit" target="_blank">Docs</a> */
      limit?: number;
      /** Offset amount of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#offset" target="_blank">Docs</a> */
      offset?: number;
      /** Page portion of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#page" target="_blank">Docs</a> */
      page?: number;
      /** Reset cache (if was enabled). <a href="https://github.com/nestjsx/crud/wiki/Requests#cache" target="_blank">Docs</a> */
      cache?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any | null> {
    return new Promise((resolve, reject) => {
      let url = '/assets';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        fields: params['fields'],
        s: params['s'],
        filter: params['filter'],
        or: params['or'],
        sort: params['sort'],
        join: params['join'],
        limit: params['limit'],
        offset: params['offset'],
        page: params['page'],
        cache: params['cache']
      };
      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create one Asset
   */
  createOneBaseAssetsControllerAsset(
    params: {
      /** requestBody */
      body?: AssetCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Asset> {
    return new Promise((resolve, reject) => {
      let url = '/assets';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create many Asset
   */
  createManyBaseAssetsControllerAsset(
    params: {
      /** requestBody */
      body?: CreateManyAssetDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Asset[]> {
    return new Promise((resolve, reject) => {
      let url = '/assets/bulk';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class PreferencesService {
  /**
   * Retrieve one Preference
   */
  getOneBasePreferencesControllerPreference(
    params: {
      /**  */
      id: string;
      /** Selects resource fields. <a href="https://github.com/nestjsx/crud/wiki/Requests#select" target="_blank">Docs</a> */
      fields?: any | null[];
      /** Adds relational resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#join" target="_blank">Docs</a> */
      join?: any | null[];
      /** Reset cache (if was enabled). <a href="https://github.com/nestjsx/crud/wiki/Requests#cache" target="_blank">Docs</a> */
      cache?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Preference> {
    return new Promise((resolve, reject) => {
      let url = '/preferences/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { fields: params['fields'], join: params['join'], cache: params['cache'] };
      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update one Preference
   */
  updateOneBasePreferencesControllerPreference(
    params: {
      /**  */
      id: string;
      /** requestBody */
      body?: Preference;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Preference> {
    return new Promise((resolve, reject) => {
      let url = '/preferences/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('patch', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Replace one Preference
   */
  replaceOneBasePreferencesControllerPreference(
    params: {
      /**  */
      id: string;
      /** requestBody */
      body?: Preference;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Preference> {
    return new Promise((resolve, reject) => {
      let url = '/preferences/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete one Preference
   */
  deleteOneBasePreferencesControllerPreference(
    params: {
      /**  */
      id: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '/preferences/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Retrieve many Preference
   */
  getManyBasePreferencesControllerPreference(
    params: {
      /** Selects resource fields. <a href="https://github.com/nestjsx/crud/wiki/Requests#select" target="_blank">Docs</a> */
      fields?: any | null[];
      /** Adds search condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#search" target="_blank">Docs</a> */
      s?: string;
      /** Adds filter condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#filter" target="_blank">Docs</a> */
      filter?: any | null[];
      /** Adds OR condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#or" target="_blank">Docs</a> */
      or?: any | null[];
      /** Adds sort by field. <a href="https://github.com/nestjsx/crud/wiki/Requests#sort" target="_blank">Docs</a> */
      sort?: any | null[];
      /** Adds relational resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#join" target="_blank">Docs</a> */
      join?: any | null[];
      /** Limit amount of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#limit" target="_blank">Docs</a> */
      limit?: number;
      /** Offset amount of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#offset" target="_blank">Docs</a> */
      offset?: number;
      /** Page portion of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#page" target="_blank">Docs</a> */
      page?: number;
      /** Reset cache (if was enabled). <a href="https://github.com/nestjsx/crud/wiki/Requests#cache" target="_blank">Docs</a> */
      cache?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any | null> {
    return new Promise((resolve, reject) => {
      let url = '/preferences';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        fields: params['fields'],
        s: params['s'],
        filter: params['filter'],
        or: params['or'],
        sort: params['sort'],
        join: params['join'],
        limit: params['limit'],
        offset: params['offset'],
        page: params['page'],
        cache: params['cache']
      };
      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create one Preference
   */
  createOneBasePreferencesControllerPreference(
    params: {
      /** requestBody */
      body?: PreferenceCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Preference> {
    return new Promise((resolve, reject) => {
      let url = '/preferences';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create many Preference
   */
  createManyBasePreferencesControllerPreference(
    params: {
      /** requestBody */
      body?: CreateManyPreferenceDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Preference[]> {
    return new Promise((resolve, reject) => {
      let url = '/preferences/bulk';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class ApplicationMethodsService {
  /**
   * Retrieve one ApplicationMethod
   */
  getOneBaseApplicationMethodsControllerApplicationMethod(
    params: {
      /**  */
      id: string;
      /** Selects resource fields. <a href="https://github.com/nestjsx/crud/wiki/Requests#select" target="_blank">Docs</a> */
      fields?: any | null[];
      /** Adds relational resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#join" target="_blank">Docs</a> */
      join?: any | null[];
      /** Reset cache (if was enabled). <a href="https://github.com/nestjsx/crud/wiki/Requests#cache" target="_blank">Docs</a> */
      cache?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationMethod> {
    return new Promise((resolve, reject) => {
      let url = '/applicationMethods/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { fields: params['fields'], join: params['join'], cache: params['cache'] };
      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update one ApplicationMethod
   */
  updateOneBaseApplicationMethodsControllerApplicationMethod(
    params: {
      /**  */
      id: string;
      /** requestBody */
      body?: ApplicationMethod;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationMethod> {
    return new Promise((resolve, reject) => {
      let url = '/applicationMethods/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('patch', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Replace one ApplicationMethod
   */
  replaceOneBaseApplicationMethodsControllerApplicationMethod(
    params: {
      /**  */
      id: string;
      /** requestBody */
      body?: ApplicationMethod;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationMethod> {
    return new Promise((resolve, reject) => {
      let url = '/applicationMethods/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete one ApplicationMethod
   */
  deleteOneBaseApplicationMethodsControllerApplicationMethod(
    params: {
      /**  */
      id: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '/applicationMethods/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Retrieve many ApplicationMethod
   */
  getManyBaseApplicationMethodsControllerApplicationMethod(
    params: {
      /** Selects resource fields. <a href="https://github.com/nestjsx/crud/wiki/Requests#select" target="_blank">Docs</a> */
      fields?: any | null[];
      /** Adds search condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#search" target="_blank">Docs</a> */
      s?: string;
      /** Adds filter condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#filter" target="_blank">Docs</a> */
      filter?: any | null[];
      /** Adds OR condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#or" target="_blank">Docs</a> */
      or?: any | null[];
      /** Adds sort by field. <a href="https://github.com/nestjsx/crud/wiki/Requests#sort" target="_blank">Docs</a> */
      sort?: any | null[];
      /** Adds relational resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#join" target="_blank">Docs</a> */
      join?: any | null[];
      /** Limit amount of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#limit" target="_blank">Docs</a> */
      limit?: number;
      /** Offset amount of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#offset" target="_blank">Docs</a> */
      offset?: number;
      /** Page portion of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#page" target="_blank">Docs</a> */
      page?: number;
      /** Reset cache (if was enabled). <a href="https://github.com/nestjsx/crud/wiki/Requests#cache" target="_blank">Docs</a> */
      cache?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any | null> {
    return new Promise((resolve, reject) => {
      let url = '/applicationMethods';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        fields: params['fields'],
        s: params['s'],
        filter: params['filter'],
        or: params['or'],
        sort: params['sort'],
        join: params['join'],
        limit: params['limit'],
        offset: params['offset'],
        page: params['page'],
        cache: params['cache']
      };
      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create one ApplicationMethod
   */
  createOneBaseApplicationMethodsControllerApplicationMethod(
    params: {
      /** requestBody */
      body?: ApplicationMethodCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationMethod> {
    return new Promise((resolve, reject) => {
      let url = '/applicationMethods';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create many ApplicationMethod
   */
  createManyBaseApplicationMethodsControllerApplicationMethod(
    params: {
      /** requestBody */
      body?: CreateManyApplicationMethodDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationMethod[]> {
    return new Promise((resolve, reject) => {
      let url = '/applicationMethods/bulk';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class UnitsService {
  /**
   * Retrieve one Unit
   */
  getOneBaseUnitsControllerUnit(
    params: {
      /**  */
      id: string;
      /** Selects resource fields. <a href="https://github.com/nestjsx/crud/wiki/Requests#select" target="_blank">Docs</a> */
      fields?: any | null[];
      /** Adds relational resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#join" target="_blank">Docs</a> */
      join?: any | null[];
      /** Reset cache (if was enabled). <a href="https://github.com/nestjsx/crud/wiki/Requests#cache" target="_blank">Docs</a> */
      cache?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Unit> {
    return new Promise((resolve, reject) => {
      let url = '/units/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { fields: params['fields'], join: params['join'], cache: params['cache'] };
      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update one Unit
   */
  updateOneBaseUnitsControllerUnit(
    params: {
      /**  */
      id: string;
      /** requestBody */
      body?: Unit;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Unit> {
    return new Promise((resolve, reject) => {
      let url = '/units/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('patch', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Replace one Unit
   */
  replaceOneBaseUnitsControllerUnit(
    params: {
      /**  */
      id: string;
      /** requestBody */
      body?: Unit;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Unit> {
    return new Promise((resolve, reject) => {
      let url = '/units/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete one Unit
   */
  deleteOneBaseUnitsControllerUnit(
    params: {
      /**  */
      id: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = '/units/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Retrieve many Unit
   */
  getManyBaseUnitsControllerUnit(
    params: {
      /** Selects resource fields. <a href="https://github.com/nestjsx/crud/wiki/Requests#select" target="_blank">Docs</a> */
      fields?: any | null[];
      /** Adds search condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#search" target="_blank">Docs</a> */
      s?: string;
      /** Adds filter condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#filter" target="_blank">Docs</a> */
      filter?: any | null[];
      /** Adds OR condition. <a href="https://github.com/nestjsx/crud/wiki/Requests#or" target="_blank">Docs</a> */
      or?: any | null[];
      /** Adds sort by field. <a href="https://github.com/nestjsx/crud/wiki/Requests#sort" target="_blank">Docs</a> */
      sort?: any | null[];
      /** Adds relational resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#join" target="_blank">Docs</a> */
      join?: any | null[];
      /** Limit amount of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#limit" target="_blank">Docs</a> */
      limit?: number;
      /** Offset amount of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#offset" target="_blank">Docs</a> */
      offset?: number;
      /** Page portion of resources. <a href="https://github.com/nestjsx/crud/wiki/Requests#page" target="_blank">Docs</a> */
      page?: number;
      /** Reset cache (if was enabled). <a href="https://github.com/nestjsx/crud/wiki/Requests#cache" target="_blank">Docs</a> */
      cache?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any | null> {
    return new Promise((resolve, reject) => {
      let url = '/units';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        fields: params['fields'],
        s: params['s'],
        filter: params['filter'],
        or: params['or'],
        sort: params['sort'],
        join: params['join'],
        limit: params['limit'],
        offset: params['offset'],
        page: params['page'],
        cache: params['cache']
      };
      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create one Unit
   */
  createOneBaseUnitsControllerUnit(
    params: {
      /** requestBody */
      body?: UnitCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Unit> {
    return new Promise((resolve, reject) => {
      let url = '/units';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create many Unit
   */
  createManyBaseUnitsControllerUnit(
    params: {
      /** requestBody */
      body?: CreateManyUnitDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Unit[]> {
    return new Promise((resolve, reject) => {
      let url = '/units/bulk';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export interface LoginDto {
  /**  */
  email: string;

  /**  */
  password: string;
}

export interface LoginResponseDto {
  /**  */
  accessToken: string;
}

export interface CreateUserDto {
  /**  */
  email: string;

  /**  */
  firstName: string;

  /**  */
  middleName: string;

  /**  */
  lastName: string;

  /**  */
  dob: Date;

  /**  */
  password: string;
}

export interface ApplicationMethodDto {
  /**  */
  id: string;

  /**  */
  createdAt: string;

  /**  */
  updatedAt: string;

  /**  */
  type: EnumApplicationMethodDtoType;

  /**  */
  label: string;

  /**  */
  externalReference: string;

  /**  */
  acceptsPostmarkedApplications: boolean;
}

export interface AssetDto {
  /**  */
  id: string;

  /**  */
  createdAt: string;

  /**  */
  updatedAt: string;

  /**  */
  label: string;

  /**  */
  fileId: string;
}

export interface PreferenceLink {
  /**  */
  title: string;

  /**  */
  url: string;
}

export interface PreferenceDto {
  /**  */
  id: string;

  /**  */
  createdAt: string;

  /**  */
  updatedAt: string;

  /**  */
  ordinal: number;

  /**  */
  title: string;

  /**  */
  subtitle: string;

  /**  */
  description: string;

  /**  */
  links: PreferenceLink[];
}

export interface UnitDto {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  amiPercentage: string;

  /**  */
  annualIncomeMin: string;

  /**  */
  monthlyIncomeMin: string;

  /**  */
  floor: number;

  /**  */
  annualIncomeMax: string;

  /**  */
  maxOccupancy: number;

  /**  */
  minOccupancy: number;

  /**  */
  monthlyRent: string;

  /**  */
  numBathrooms: number;

  /**  */
  numBedrooms: number;

  /**  */
  number: string;

  /**  */
  priorityType: string;

  /**  */
  reservedType: string;

  /**  */
  sqFeet: number;

  /**  */
  status: string;

  /**  */
  unitType: string;

  /**  */
  amiChartId: number;

  /**  */
  monthlyRentAsPercentOfIncome: number;

  /**  */
  bmrProgramChart: boolean;
}

export interface User {
  /**  */
  id: string;

  /**  */
  passwordHash: string;

  /**  */
  email: string;

  /**  */
  firstName: string;

  /**  */
  middleName: string;

  /**  */
  lastName: string;

  /**  */
  dob: Date;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  applications: Application[];

  /**  */
  isAdmin: boolean;
}

export interface GetManyPreferenceResponseDto {
  /**  */
  data: Preference[];

  /**  */
  count: number;

  /**  */
  total: number;

  /**  */
  page: number;

  /**  */
  pageCount: number;
}

export interface Preference {
  /**  */
  id: string;

  /**  */
  createdAt: string;

  /**  */
  updatedAt: string;

  /**  */
  ordinal: number;

  /**  */
  title: string;

  /**  */
  subtitle: string;

  /**  */
  description: string;

  /**  */
  links: PreferenceLink[];

  /**  */
  listing: Listing;
}

export interface GetManyUnitResponseDto {
  /**  */
  data: Unit[];

  /**  */
  count: number;

  /**  */
  total: number;

  /**  */
  page: number;

  /**  */
  pageCount: number;
}

export interface Unit {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  amiPercentage: string;

  /**  */
  annualIncomeMin: string;

  /**  */
  monthlyIncomeMin: string;

  /**  */
  floor: number;

  /**  */
  annualIncomeMax: string;

  /**  */
  maxOccupancy: number;

  /**  */
  minOccupancy: number;

  /**  */
  monthlyRent: string;

  /**  */
  numBathrooms: number;

  /**  */
  numBedrooms: number;

  /**  */
  number: string;

  /**  */
  priorityType: string;

  /**  */
  reservedType: string;

  /**  */
  sqFeet: number;

  /**  */
  status: string;

  /**  */
  unitType: string;

  /**  */
  amiChartId: number;

  /**  */
  monthlyRentAsPercentOfIncome: number;

  /**  */
  listing: Listing;

  /**  */
  bmrProgramChart: boolean;
}

export interface GetManyApplicationMethodResponseDto {
  /**  */
  data: ApplicationMethod[];

  /**  */
  count: number;

  /**  */
  total: number;

  /**  */
  page: number;

  /**  */
  pageCount: number;
}

export interface ApplicationMethod {
  /**  */
  id: string;

  /**  */
  createdAt: string;

  /**  */
  updatedAt: string;

  /**  */
  type: EnumApplicationMethodType;

  /**  */
  label: string;

  /**  */
  externalReference: string;

  /**  */
  acceptsPostmarkedApplications: boolean;

  /**  */
  listing: Listing;
}

export interface GetManyAssetResponseDto {
  /**  */
  data: Asset[];

  /**  */
  count: number;

  /**  */
  total: number;

  /**  */
  page: number;

  /**  */
  pageCount: number;
}

export interface Asset {
  /**  */
  id: string;

  /**  */
  createdAt: string;

  /**  */
  updatedAt: string;

  /**  */
  label: string;

  /**  */
  fileId: string;

  /**  */
  listing: CombinedListingTypes;
}

export interface Address {
  /**  */
  placeName: string;

  /**  */
  city: string;

  /**  */
  county: string;

  /**  */
  state: string;

  /**  */
  street: string;

  /**  */
  street2: string;

  /**  */
  zipCode: string;

  /**  */
  latitude: number;

  /**  */
  longitude: number;
}

export interface WhatToExpect {
  /**  */
  applicantsWillBeContacted: string;

  /**  */
  allInfoWillBeVerified: string;

  /**  */
  bePreparedIfChosen: string;
}

export interface Listing {
  /**  */
  id: string;

  /**  */
  createdAt: string;

  /**  */
  updatedAt: string;

  /**  */
  preferences: Preference[];

  /**  */
  units: Unit[];

  /**  */
  applicationMethods: ApplicationMethod[];

  /**  */
  assets: Asset[];

  /**  */
  applications: Application[];

  /**  */
  accessibility: string;

  /**  */
  amenities: string;

  /**  */
  applicationDueDate: string;

  /**  */
  applicationOpenDate: string;

  /**  */
  applicationFee: string;

  /**  */
  applicationOrganization: string;

  /**  */
  applicationAddress: CombinedApplicationAddressTypes;

  /**  */
  blankPaperApplicationCanBePickedUp: boolean;

  /**  */
  buildingAddress: CombinedBuildingAddressTypes;

  /**  */
  buildingTotalUnits: number;

  /**  */
  buildingSelectionCriteria: string;

  /**  */
  costsNotIncluded: string;

  /**  */
  creditHistory: string;

  /**  */
  criminalBackground: string;

  /**  */
  depositMin: string;

  /**  */
  depositMax: string;

  /**  */
  developer: string;

  /**  */
  disableUnitsAccordion: boolean;

  /**  */
  householdSizeMax: number;

  /**  */
  householdSizeMin: number;

  /**  */
  imageUrl: string;

  /**  */
  leasingAgentAddress: CombinedLeasingAgentAddressTypes;

  /**  */
  leasingAgentEmail: string;

  /**  */
  leasingAgentName: string;

  /**  */
  leasingAgentOfficeHours: string;

  /**  */
  leasingAgentPhone: string;

  /**  */
  leasingAgentTitle: string;

  /**  */
  name: string;

  /**  */
  neighborhood: string;

  /**  */
  petPolicy: string;

  /**  */
  postmarkedApplicationsReceivedByDate: string;

  /**  */
  programRules: string;

  /**  */
  rentalAssistance: string;

  /**  */
  rentalHistory: string;

  /**  */
  requiredDocuments: string;

  /**  */
  smokingPolicy: string;

  /**  */
  unitsAvailable: number;

  /**  */
  unitAmenities: string;

  /**  */
  waitlistCurrentSize: number;

  /**  */
  waitlistMaxSize: number;

  /**  */
  whatToExpect: CombinedWhatToExpectTypes;

  /**  */
  yearBuilt: number;

  /**  */
  status: EnumListingStatus;

  /**  */
  unitsSummarized: object;

  /**  */
  urlSlug: string;
}

export interface Application {
  /**  */
  id: string;

  /**  */
  createdAt: string;

  /**  */
  updatedAt: string;

  /**  */
  appUrl: string;

  /**  */
  user: CombinedUserTypes;

  /**  */
  listing: Listing;

  /**  */
  application: object;
}

export interface ListingDto {
  /**  */
  applicationMethods: ApplicationMethodDto[];

  /**  */
  assets: AssetDto[];

  /**  */
  preferences: PreferenceDto[];

  /**  */
  units: UnitDto[];

  /**  */
  id: string;

  /**  */
  createdAt: string;

  /**  */
  updatedAt: string;

  /**  */
  applications: Application[];

  /**  */
  accessibility: string;

  /**  */
  amenities: string;

  /**  */
  applicationDueDate: string;

  /**  */
  applicationOpenDate: string;

  /**  */
  applicationFee: string;

  /**  */
  applicationOrganization: string;

  /**  */
  applicationAddress: CombinedApplicationAddressTypes;

  /**  */
  blankPaperApplicationCanBePickedUp: boolean;

  /**  */
  buildingAddress: CombinedBuildingAddressTypes;

  /**  */
  buildingTotalUnits: number;

  /**  */
  buildingSelectionCriteria: string;

  /**  */
  costsNotIncluded: string;

  /**  */
  creditHistory: string;

  /**  */
  criminalBackground: string;

  /**  */
  depositMin: string;

  /**  */
  depositMax: string;

  /**  */
  developer: string;

  /**  */
  disableUnitsAccordion: boolean;

  /**  */
  householdSizeMax: number;

  /**  */
  householdSizeMin: number;

  /**  */
  imageUrl: string;

  /**  */
  leasingAgentAddress: CombinedLeasingAgentAddressTypes;

  /**  */
  leasingAgentEmail: string;

  /**  */
  leasingAgentName: string;

  /**  */
  leasingAgentOfficeHours: string;

  /**  */
  leasingAgentPhone: string;

  /**  */
  leasingAgentTitle: string;

  /**  */
  name: string;

  /**  */
  neighborhood: string;

  /**  */
  petPolicy: string;

  /**  */
  postmarkedApplicationsReceivedByDate: string;

  /**  */
  programRules: string;

  /**  */
  rentalAssistance: string;

  /**  */
  rentalHistory: string;

  /**  */
  requiredDocuments: string;

  /**  */
  smokingPolicy: string;

  /**  */
  unitsAvailable: number;

  /**  */
  unitAmenities: string;

  /**  */
  waitlistCurrentSize: number;

  /**  */
  waitlistMaxSize: number;

  /**  */
  whatToExpect: CombinedWhatToExpectTypes;

  /**  */
  yearBuilt: number;

  /**  */
  status: EnumListingDtoStatus;

  /**  */
  unitsSummarized: object;

  /**  */
  urlSlug: string;
}

export interface ListingExtendedDto {
  /**  */
  status: EnumListingExtendedDtoStatus;

  /**  */
  listings: ListingDto[];

  /**  */
  amiCharts: object;
}

export interface IdDto {
  /**  */
  id: string;
}

export interface ListingCreateDto {
  /**  */
  applicationMethods: IdDto[];

  /**  */
  assets: IdDto[];

  /**  */
  preferences: IdDto[];

  /**  */
  units: IdDto[];

  /**  */
  applications: Application[];

  /**  */
  accessibility: string;

  /**  */
  amenities: string;

  /**  */
  applicationDueDate: string;

  /**  */
  applicationOpenDate: string;

  /**  */
  applicationFee: string;

  /**  */
  applicationOrganization: string;

  /**  */
  applicationAddress: CombinedApplicationAddressTypes;

  /**  */
  blankPaperApplicationCanBePickedUp: boolean;

  /**  */
  buildingAddress: CombinedBuildingAddressTypes;

  /**  */
  buildingTotalUnits: number;

  /**  */
  buildingSelectionCriteria: string;

  /**  */
  costsNotIncluded: string;

  /**  */
  creditHistory: string;

  /**  */
  criminalBackground: string;

  /**  */
  depositMin: string;

  /**  */
  depositMax: string;

  /**  */
  developer: string;

  /**  */
  disableUnitsAccordion: boolean;

  /**  */
  householdSizeMax: number;

  /**  */
  householdSizeMin: number;

  /**  */
  imageUrl: string;

  /**  */
  leasingAgentAddress: CombinedLeasingAgentAddressTypes;

  /**  */
  leasingAgentEmail: string;

  /**  */
  leasingAgentName: string;

  /**  */
  leasingAgentOfficeHours: string;

  /**  */
  leasingAgentPhone: string;

  /**  */
  leasingAgentTitle: string;

  /**  */
  name: string;

  /**  */
  neighborhood: string;

  /**  */
  petPolicy: string;

  /**  */
  postmarkedApplicationsReceivedByDate: string;

  /**  */
  programRules: string;

  /**  */
  rentalAssistance: string;

  /**  */
  rentalHistory: string;

  /**  */
  requiredDocuments: string;

  /**  */
  smokingPolicy: string;

  /**  */
  unitsAvailable: number;

  /**  */
  unitAmenities: string;

  /**  */
  waitlistCurrentSize: number;

  /**  */
  waitlistMaxSize: number;

  /**  */
  whatToExpect: CombinedWhatToExpectTypes;

  /**  */
  yearBuilt: number;

  /**  */
  status: EnumListingCreateDtoStatus;

  /**  */
  unitsSummarized: object;

  /**  */
  urlSlug: string;
}

export interface ListingUpdateDto {
  /**  */
  applicationMethods: IdDto[];

  /**  */
  assets: IdDto[];

  /**  */
  preferences: IdDto[];

  /**  */
  units: IdDto[];

  /**  */
  applications: Application[];

  /**  */
  accessibility: string;

  /**  */
  amenities: string;

  /**  */
  applicationDueDate: string;

  /**  */
  applicationOpenDate: string;

  /**  */
  applicationFee: string;

  /**  */
  applicationOrganization: string;

  /**  */
  applicationAddress: CombinedApplicationAddressTypes;

  /**  */
  blankPaperApplicationCanBePickedUp: boolean;

  /**  */
  buildingAddress: CombinedBuildingAddressTypes;

  /**  */
  buildingTotalUnits: number;

  /**  */
  buildingSelectionCriteria: string;

  /**  */
  costsNotIncluded: string;

  /**  */
  creditHistory: string;

  /**  */
  criminalBackground: string;

  /**  */
  depositMin: string;

  /**  */
  depositMax: string;

  /**  */
  developer: string;

  /**  */
  disableUnitsAccordion: boolean;

  /**  */
  householdSizeMax: number;

  /**  */
  householdSizeMin: number;

  /**  */
  imageUrl: string;

  /**  */
  leasingAgentAddress: CombinedLeasingAgentAddressTypes;

  /**  */
  leasingAgentEmail: string;

  /**  */
  leasingAgentName: string;

  /**  */
  leasingAgentOfficeHours: string;

  /**  */
  leasingAgentPhone: string;

  /**  */
  leasingAgentTitle: string;

  /**  */
  name: string;

  /**  */
  neighborhood: string;

  /**  */
  petPolicy: string;

  /**  */
  postmarkedApplicationsReceivedByDate: string;

  /**  */
  programRules: string;

  /**  */
  rentalAssistance: string;

  /**  */
  rentalHistory: string;

  /**  */
  requiredDocuments: string;

  /**  */
  smokingPolicy: string;

  /**  */
  unitsAvailable: number;

  /**  */
  unitAmenities: string;

  /**  */
  waitlistCurrentSize: number;

  /**  */
  waitlistMaxSize: number;

  /**  */
  whatToExpect: CombinedWhatToExpectTypes;

  /**  */
  yearBuilt: number;

  /**  */
  status: EnumListingUpdateDtoStatus;

  /**  */
  unitsSummarized: object;

  /**  */
  urlSlug: string;

  /**  */
  id: string;
}

export interface ApplicationDto {
  /**  */
  listing: IdDto;

  /**  */
  id: string;

  /**  */
  createdAt: string;

  /**  */
  updatedAt: string;

  /**  */
  appUrl: string;

  /**  */
  application: object;
}

export interface ApplicationCreateDto {
  /**  */
  appUrl: string;

  /**  */
  application: object;

  /**  */
  listing: IdDto;
}

export interface ApplicationUpdateDto {
  /**  */
  appUrl: string;

  /**  */
  application: object;

  /**  */
  listing: IdDto;

  /**  */
  id: string;
}

export interface AssetCreateDto {
  /**  */
  label: string;

  /**  */
  fileId: string;
}

export interface CreateManyAssetDto {
  /**  */
  bulk: AssetCreateDto[];
}

export interface PreferenceCreateDto {
  /**  */
  ordinal: number;

  /**  */
  title: string;

  /**  */
  subtitle: string;

  /**  */
  description: string;

  /**  */
  links: PreferenceLink[];
}

export interface CreateManyPreferenceDto {
  /**  */
  bulk: PreferenceCreateDto[];
}

export interface ApplicationMethodCreateDto {
  /**  */
  type: EnumApplicationMethodCreateDtoType;

  /**  */
  label: string;

  /**  */
  externalReference: string;

  /**  */
  acceptsPostmarkedApplications: boolean;
}

export interface CreateManyApplicationMethodDto {
  /**  */
  bulk: ApplicationMethodCreateDto[];
}

export interface UnitCreateDto {
  /**  */
  amiPercentage: string;

  /**  */
  annualIncomeMin: string;

  /**  */
  monthlyIncomeMin: string;

  /**  */
  floor: number;

  /**  */
  annualIncomeMax: string;

  /**  */
  maxOccupancy: number;

  /**  */
  minOccupancy: number;

  /**  */
  monthlyRent: string;

  /**  */
  numBathrooms: number;

  /**  */
  numBedrooms: number;

  /**  */
  number: string;

  /**  */
  priorityType: string;

  /**  */
  reservedType: string;

  /**  */
  sqFeet: number;

  /**  */
  status: string;

  /**  */
  unitType: string;

  /**  */
  amiChartId: number;

  /**  */
  monthlyRentAsPercentOfIncome: number;

  /**  */
  bmrProgramChart: boolean;
}

export interface CreateManyUnitDto {
  /**  */
  bulk: UnitCreateDto[];
}
export enum EnumApplicationMethodDtoType {
  'Internal' = 'Internal',
  'FileDownload' = 'FileDownload',
  'ExternalLink' = 'ExternalLink',
  'PaperPickup' = 'PaperPickup',
  'POBox' = 'POBox',
  'LeasingAgent' = 'LeasingAgent'
}
export enum EnumApplicationMethodType {
  'Internal' = 'Internal',
  'FileDownload' = 'FileDownload',
  'ExternalLink' = 'ExternalLink',
  'PaperPickup' = 'PaperPickup',
  'POBox' = 'POBox',
  'LeasingAgent' = 'LeasingAgent'
}
export type CombinedListingTypes = (Listing & any) | null;
export type CombinedApplicationAddressTypes = (Address & any) | null;
export type CombinedBuildingAddressTypes = (Address & any) | null;
export type CombinedLeasingAgentAddressTypes = (Address & any) | null;
export type CombinedWhatToExpectTypes = (WhatToExpect & any) | null;
export enum EnumListingStatus {
  'active' = 'active',
  'pending' = 'pending'
}
export type CombinedUserTypes = (User & any) | null;
export enum EnumListingDtoStatus {
  'active' = 'active',
  'pending' = 'pending'
}
export enum EnumListingExtendedDtoStatus {
  'ok' = 'ok'
}
export enum EnumListingCreateDtoStatus {
  'active' = 'active',
  'pending' = 'pending'
}
export enum EnumListingUpdateDtoStatus {
  'active' = 'active',
  'pending' = 'pending'
}
export enum EnumApplicationMethodCreateDtoType {
  'Internal' = 'Internal',
  'FileDownload' = 'FileDownload',
  'ExternalLink' = 'ExternalLink',
  'PaperPickup' = 'PaperPickup',
  'POBox' = 'POBox',
  'LeasingAgent' = 'LeasingAgent'
}
