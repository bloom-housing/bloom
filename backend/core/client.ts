/** Generate by swagger-axios-codegen */
// tslint:disable
/* eslint-disable */
import axiosStatic, { AxiosInstance } from 'axios';

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
  const configs: IRequestConfig = { ...options, method, url };
  configs.headers = {
    ...options.headers,
    'Content-Type': contentType
  };
  return configs;
}

const basePath = '';

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

export class PagedResult<T> implements IPagedResult<T> {
  totalCount?: number;
  items?: T[];
}

// customer definition
// empty

export class UserService {
  /**
   *
   */
  userControllerProfile(options: IRequestOptions = {}): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create user
   */
  create(
    params: {
      /** requestBody */
      body?: UserCreate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UserWithAccessToken> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update user
   */
  update(
    params: {
      /** requestBody */
      body?: UserUpdate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/{id}';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class AuthService {
  /**
   * Login
   */
  login(
    params: {
      /** requestBody */
      body?: Login;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/login';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Token
   */
  token(options: IRequestOptions = {}): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/auth/token';

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
      jsonpath?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Listing[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/listings';

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
      body?: ListingCreate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Listing> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/listings';

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
      let url = basePath + '/listings/{listingId}';
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
      body?: ListingUpdate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Listing> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/listings/{listingId}';
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
      let url = basePath + '/listings/{listingId}';
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
      page?: number;
      /**  */
      limit?: number;
      /**  */
      listingId?: string;
      /**  */
      search?: string;
      /**  */
      userId?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedApplication> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        page: params['page'],
        limit: params['limit'],
        listingId: params['listingId'],
        search: params['search'],
        userId: params['userId']
      };
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
      body?: ApplicationCreate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications';

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
      listingId?: string;
      /**  */
      includeHeaders?: boolean;
      /**  */
      userId?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications/csv';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        listingId: params['listingId'],
        includeHeaders: params['includeHeaders'],
        userId: params['userId']
      };
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
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications/{applicationId}';
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
      body?: ApplicationUpdate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications/{applicationId}';
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
      let url = basePath + '/applications/{applicationId}';
      url = url.replace('{applicationId}', params['applicationId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Submit application
   */
  submit(
    params: {
      /** requestBody */
      body?: ApplicationCreate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications/submit';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class AssetsService {
  /**
   * List assets
   */
  list(options: IRequestOptions = {}): Promise<Asset[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/assets';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create asset
   */
  create(
    params: {
      /** requestBody */
      body?: AssetCreate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Asset> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/assets';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update asset
   */
  update(
    params: {
      /** requestBody */
      body?: AssetUpdate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Asset> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/assets/{assetId}';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Get asset by id
   */
  retrieve(
    params: {
      /**  */
      assetId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Asset> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/assets/{assetId}';
      url = url.replace('{assetId}', params['assetId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete asset by id
   */
  delete(
    params: {
      /**  */
      assetId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/assets/{assetId}';
      url = url.replace('{assetId}', params['assetId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class PreferencesService {
  /**
   * List preferences
   */
  list(options: IRequestOptions = {}): Promise<Preference[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/preferences';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create preference
   */
  create(
    params: {
      /** requestBody */
      body?: PreferenceCreate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Preference> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/preferences';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update preference
   */
  update(
    params: {
      /** requestBody */
      body?: PreferenceUpdate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Preference> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/preferences/{preferenceId}';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Get preference by id
   */
  retrieve(
    params: {
      /**  */
      preferenceId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Preference> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/preferences/{preferenceId}';
      url = url.replace('{preferenceId}', params['preferenceId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete preference by id
   */
  delete(
    params: {
      /**  */
      preferenceId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/preferences/{preferenceId}';
      url = url.replace('{preferenceId}', params['preferenceId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class ApplicationMethodsService {
  /**
   * List applicationMethods
   */
  list(options: IRequestOptions = {}): Promise<ApplicationMethod[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applicationMethods';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create applicationMethod
   */
  create(
    params: {
      /** requestBody */
      body?: ApplicationMethodCreate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationMethod> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applicationMethods';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update applicationMethod
   */
  update(
    params: {
      /** requestBody */
      body?: ApplicationMethodUpdate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationMethod> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applicationMethods/{applicationMethodId}';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Get applicationMethod by id
   */
  retrieve(
    params: {
      /**  */
      applicationMethodId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationMethod> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applicationMethods/{applicationMethodId}';
      url = url.replace('{applicationMethodId}', params['applicationMethodId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete applicationMethod by id
   */
  delete(
    params: {
      /**  */
      applicationMethodId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applicationMethods/{applicationMethodId}';
      url = url.replace('{applicationMethodId}', params['applicationMethodId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class UnitsService {
  /**
   * List units
   */
  list(options: IRequestOptions = {}): Promise<Unit[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/units';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create unit
   */
  create(
    params: {
      /** requestBody */
      body?: UnitCreate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Unit> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/units';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update unit
   */
  update(
    params: {
      /** requestBody */
      body?: UnitUpdate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Unit> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/units/{unitId}';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Get unit by id
   */
  retrieve(
    params: {
      /**  */
      unitId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Unit> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/units/{unitId}';
      url = url.replace('{unitId}', params['unitId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete unit by id
   */
  delete(
    params: {
      /**  */
      unitId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/units/{unitId}';
      url = url.replace('{unitId}', params['unitId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class ListingEventsService {
  /**
   * List listingEvents
   */
  list(options: IRequestOptions = {}): Promise<ListingEvent[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/listingEvents';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create listingEvent
   */
  create(
    params: {
      /** requestBody */
      body?: ListingEventCreate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ListingEvent> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/listingEvents';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update listingEvent
   */
  update(
    params: {
      /** requestBody */
      body?: ListingEventUpdate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ListingEvent> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/listingEvents/{listingEventId}';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Get listingEvent by id
   */
  retrieve(
    params: {
      /**  */
      listingEventId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ListingEvent> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/listingEvents/{listingEventId}';
      url = url.replace('{listingEventId}', params['listingEventId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete listingEvent by id
   */
  delete(
    params: {
      /**  */
      listingEventId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/listingEvents/{listingEventId}';
      url = url.replace('{listingEventId}', params['listingEventId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class PropertiesService {
  /**
   * List properties
   */
  list(options: IRequestOptions = {}): Promise<Property[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/properties';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create property
   */
  create(
    params: {
      /** requestBody */
      body?: PropertyCreate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Property> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/properties';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update property
   */
  update(
    params: {
      /** requestBody */
      body?: PropertyUpdate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Property> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/properties/{propertyId}';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Get property by id
   */
  retrieve(
    params: {
      /**  */
      propertyId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Property> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/properties/{propertyId}';
      url = url.replace('{propertyId}', params['propertyId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete property by id
   */
  delete(
    params: {
      /**  */
      propertyId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/properties/{propertyId}';
      url = url.replace('{propertyId}', params['propertyId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class PropertyGroupsService {
  /**
   * List propertyGroups
   */
  list(options: IRequestOptions = {}): Promise<PropertyGroup[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/propertyGroups';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Create propertyGroup
   */
  create(
    params: {
      /** requestBody */
      body?: PropertyGroupCreate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PropertyGroup> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/propertyGroups';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Update propertyGroup
   */
  update(
    params: {
      /** requestBody */
      body?: PropertyGroupUpdate;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PropertyGroup> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/propertyGroups/{propertyGroupId}';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Get propertyGroup by id
   */
  retrieve(
    params: {
      /**  */
      propertyGroupId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PropertyGroup> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/propertyGroups/{propertyGroupId}';
      url = url.replace('{propertyGroupId}', params['propertyGroupId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete propertyGroup by id
   */
  delete(
    params: {
      /**  */
      propertyGroupId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/propertyGroups/{propertyGroupId}';
      url = url.replace('{propertyGroupId}', params['propertyGroupId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class AmiChartsService {
  /**
   * List amiCharts
   */
  list(options: IRequestOptions = {}): Promise<AmiChart[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/amiCharts';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
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
    options: IRequestOptions = {}
  ): Promise<AmiChart> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/amiCharts';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
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
    options: IRequestOptions = {}
  ): Promise<AmiChart> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/amiCharts/{amiChartId}';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

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
    options: IRequestOptions = {}
  ): Promise<AmiChart> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/amiCharts/{amiChartId}';
      url = url.replace('{amiChartId}', params['amiChartId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Delete amiChart by id
   */
  delete(
    params: {
      /**  */
      amiChartId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/amiCharts/{amiChartId}';
      url = url.replace('{amiChartId}', params['amiChartId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export class ApplicationFlaggedSetsService {
  /**
   * List application flagged sets
   */
  list(
    params: {
      /**  */
      page?: number;
      /**  */
      limit?: number;
      /**  */
      listingId?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedApplicationFlaggedSet> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applicationFlaggedSets';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { page: params['page'], limit: params['limit'], listingId: params['listingId'] };
      let data = null;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
}

export interface Id {
  /**  */
  id: string;
}

export interface User {
  /**  */
  roles: UserRole[];

  /**  */
  leasingAgentInListings?: Id[];

  /**  */
  id: string;

  /**  */
  email: string;

  /**  */
  firstName: string;

  /**  */
  middleName?: string;

  /**  */
  lastName: string;

  /**  */
  dob: Date;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface UserCreate {
  /**  */
  password: string;

  /**  */
  email: string;

  /**  */
  firstName: string;

  /**  */
  middleName?: string;

  /**  */
  lastName: string;

  /**  */
  dob: Date;
}

export interface UserWithAccessToken {
  /**  */
  roles: UserRole[];

  /**  */
  leasingAgentInListings?: Id[];

  /**  */
  id: string;

  /**  */
  email: string;

  /**  */
  firstName: string;

  /**  */
  middleName?: string;

  /**  */
  lastName: string;

  /**  */
  dob: Date;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  accessToken: string;
}

export interface UserUpdate {
  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  dob: Date;

  /**  */
  firstName: string;

  /**  */
  middleName?: string;

  /**  */
  lastName: string;
}

export interface Login {
  /**  */
  email: string;

  /**  */
  password: string;
}

export interface LoginResponse {
  /**  */
  accessToken: string;
}

export interface ApplicationMethod {
  /**  */
  type: ApplicationMethodType;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  label: string;

  /**  */
  externalReference: string;

  /**  */
  acceptsPostmarkedApplications: boolean;
}

export interface Asset {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

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

export interface Preference {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

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
  unitType: string;

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

export interface UnitSummaryByReservedType {
  /**  */
  reservedType: string;

  /**  */
  byUnitType: UnitSummary[];
}

export interface UnitSummaryByAMI {
  /**  */
  percent: string;

  /**  */
  byNonReservedUnitType: UnitSummary[];

  /**  */
  byReservedType: UnitSummaryByReservedType[];
}

export interface HMI {
  /**  */
  columns: object;

  /**  */
  rows: object[];
}

export interface UnitsSummarized {
  /**  */
  unitTypes: string[];

  /**  */
  reservedTypes: string[];

  /**  */
  priorityTypes: string[];

  /**  */
  amiPercentages: string[];

  /**  */
  byUnitType: UnitSummary[];

  /**  */
  byNonReservedUnitType: UnitSummary[];

  /**  */
  byReservedType: UnitSummaryByReservedType[];

  /**  */
  byAMI: UnitSummaryByAMI[];

  /**  */
  hmi: HMI;
}

export interface AmiChartItem {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  percentOfAmi: number;

  /**  */
  householdSize: number;

  /**  */
  income: number;
}

export interface AmiChart {
  /**  */
  items: AmiChartItem[];

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  name: string;
}

export interface Unit {
  /**  */
  amiChart: CombinedAmiChartTypes;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  amiPercentage?: string;

  /**  */
  annualIncomeMin?: string;

  /**  */
  monthlyIncomeMin?: string;

  /**  */
  floor?: number;

  /**  */
  annualIncomeMax?: string;

  /**  */
  maxOccupancy?: number;

  /**  */
  minOccupancy?: number;

  /**  */
  monthlyRent?: string;

  /**  */
  numBathrooms?: number;

  /**  */
  numBedrooms?: number;

  /**  */
  number?: string;

  /**  */
  priorityType?: string;

  /**  */
  reservedType?: string;

  /**  */
  sqFeet?: string;

  /**  */
  status?: string;

  /**  */
  unitType?: string;

  /**  */
  monthlyRentAsPercentOfIncome?: string;

  /**  */
  bmrProgramChart?: boolean;
}

export interface Address {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  placeName?: string;

  /**  */
  city?: string;

  /**  */
  county?: string;

  /**  */
  state?: string;

  /**  */
  street?: string;

  /**  */
  street2?: string;

  /**  */
  zipCode?: string;

  /**  */
  latitude?: number;

  /**  */
  longitude?: number;
}

export interface Property {
  /**  */
  unitsSummarized: UnitsSummarized;

  /**  */
  units: Unit[];

  /**  */
  buildingAddress: Address;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  accessibility: string;

  /**  */
  amenities: string;

  /**  */
  buildingTotalUnits: number;

  /**  */
  developer: string;

  /**  */
  householdSizeMax: number;

  /**  */
  householdSizeMin: number;

  /**  */
  neighborhood: string;

  /**  */
  petPolicy: string;

  /**  */
  smokingPolicy: string;

  /**  */
  unitsAvailable: number;

  /**  */
  unitAmenities: string;

  /**  */
  yearBuilt: number;
}

export interface ListingEvent {
  /**  */
  type: ListingEventType;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  startTime: Date;

  /**  */
  endTime: Date;

  /**  */
  url?: string;

  /**  */
  note?: string;
}

export interface UserBasic {
  /**  */
  id: string;

  /**  */
  email: string;

  /**  */
  firstName: string;

  /**  */
  middleName?: string;

  /**  */
  lastName: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
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
  status: ListingStatus;

  /**  */
  urlSlug: string;

  /**  */
  displayWaitlistSize: boolean;

  /**  */
  applicationMethods: ApplicationMethod[];

  /**  */
  assets: Asset[];

  /**  */
  preferences: Preference[];

  /**  */
  property: Property;

  /**  */
  events: ListingEvent[];

  /**  */
  applicationAddress: CombinedApplicationAddressTypes;

  /**  */
  applicationPickUpAddress: CombinedApplicationPickUpAddressTypes;

  /**  */
  leasingAgentAddress: CombinedLeasingAgentAddressTypes;

  /**  */
  leasingAgents?: UserBasic[];

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  applicationDueDate: Date;

  /**  */
  applicationOpenDate: Date;

  /**  */
  applicationFee: string;

  /**  */
  applicationOrganization: string;

  /**  */
  applicationPickUpAddressOfficeHours: string;

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
  disableUnitsAccordion: boolean;

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
  postmarkedApplicationsReceivedByDate: Date;

  /**  */
  programRules: string;

  /**  */
  rentalAssistance: string;

  /**  */
  rentalHistory: string;

  /**  */
  requiredDocuments: string;

  /**  */
  waitlistCurrentSize: number;

  /**  */
  waitlistMaxSize: number;

  /**  */
  whatToExpect: CombinedWhatToExpectTypes;

  /**  */
  applicationConfig?: object;
}

export interface ApplicationMethodCreate {
  /**  */
  type: ApplicationMethodType;

  /**  */
  label: string;

  /**  */
  externalReference: string;

  /**  */
  acceptsPostmarkedApplications: boolean;
}

export interface AssetCreate {
  /**  */
  label: string;

  /**  */
  fileId: string;
}

export interface PreferenceCreate {
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

export interface ListingEventCreate {
  /**  */
  type: ListingEventType;

  /**  */
  startTime: Date;

  /**  */
  endTime: Date;

  /**  */
  url?: string;

  /**  */
  note?: string;
}

export interface AddressCreate {
  /**  */
  placeName?: string;

  /**  */
  city?: string;

  /**  */
  county?: string;

  /**  */
  state?: string;

  /**  */
  street?: string;

  /**  */
  street2?: string;

  /**  */
  zipCode?: string;

  /**  */
  latitude?: number;

  /**  */
  longitude?: number;
}

export interface ListingCreate {
  /**  */
  status: ListingStatus;

  /**  */
  displayWaitlistSize: boolean;

  /**  */
  applicationMethods: ApplicationMethodCreate[];

  /**  */
  assets: AssetCreate[];

  /**  */
  preferences: PreferenceCreate[];

  /**  */
  property: Id;

  /**  */
  events: ListingEventCreate[];

  /**  */
  applicationAddress: CombinedApplicationAddressTypes;

  /**  */
  applicationPickUpAddress: CombinedApplicationPickUpAddressTypes;

  /**  */
  leasingAgentAddress: CombinedLeasingAgentAddressTypes;

  /**  */
  leasingAgents?: Id[];

  /**  */
  applicationDueDate: Date;

  /**  */
  applicationOpenDate: Date;

  /**  */
  applicationFee: string;

  /**  */
  applicationOrganization: string;

  /**  */
  applicationPickUpAddressOfficeHours: string;

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
  disableUnitsAccordion: boolean;

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
  postmarkedApplicationsReceivedByDate: Date;

  /**  */
  programRules: string;

  /**  */
  rentalAssistance: string;

  /**  */
  rentalHistory: string;

  /**  */
  requiredDocuments: string;

  /**  */
  waitlistCurrentSize: number;

  /**  */
  waitlistMaxSize: number;

  /**  */
  whatToExpect: CombinedWhatToExpectTypes;

  /**  */
  applicationConfig?: object;
}

export interface ApplicationMethodUpdate {
  /**  */
  type: ApplicationMethodType;

  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  label: string;

  /**  */
  externalReference: string;

  /**  */
  acceptsPostmarkedApplications: boolean;
}

export interface AssetUpdate {
  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  label: string;

  /**  */
  fileId: string;
}

export interface PreferenceUpdate {
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
  id: string;
}

export interface ListingEventUpdate {
  /**  */
  type: ListingEventType;

  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  startTime: Date;

  /**  */
  endTime: Date;

  /**  */
  url?: string;

  /**  */
  note?: string;
}

export interface AddressUpdate {
  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  placeName?: string;

  /**  */
  city?: string;

  /**  */
  county?: string;

  /**  */
  state?: string;

  /**  */
  street?: string;

  /**  */
  street2?: string;

  /**  */
  zipCode?: string;

  /**  */
  latitude?: number;

  /**  */
  longitude?: number;
}

export interface ListingUpdate {
  /**  */
  status: ListingStatus;

  /**  */
  displayWaitlistSize: boolean;

  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  applicationMethods: ApplicationMethodUpdate[];

  /**  */
  assets: AssetUpdate[];

  /**  */
  preferences: PreferenceUpdate[];

  /**  */
  property: Id;

  /**  */
  events: ListingEventUpdate[];

  /**  */
  applicationAddress: CombinedApplicationAddressTypes;

  /**  */
  applicationPickUpAddress: CombinedApplicationPickUpAddressTypes;

  /**  */
  leasingAgentAddress: CombinedLeasingAgentAddressTypes;

  /**  */
  leasingAgents?: Id[];

  /**  */
  applicationDueDate: Date;

  /**  */
  applicationOpenDate: Date;

  /**  */
  applicationFee: string;

  /**  */
  applicationOrganization: string;

  /**  */
  applicationPickUpAddressOfficeHours: string;

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
  disableUnitsAccordion: boolean;

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
  postmarkedApplicationsReceivedByDate: Date;

  /**  */
  programRules: string;

  /**  */
  rentalAssistance: string;

  /**  */
  rentalHistory: string;

  /**  */
  requiredDocuments: string;

  /**  */
  waitlistCurrentSize: number;

  /**  */
  waitlistMaxSize: number;

  /**  */
  whatToExpect: CombinedWhatToExpectTypes;

  /**  */
  applicationConfig?: object;
}

export interface Applicant {
  /**  */
  address: Address;

  /**  */
  workAddress: Address;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  firstName?: string;

  /**  */
  middleName?: string;

  /**  */
  lastName?: string;

  /**  */
  birthMonth?: string;

  /**  */
  birthDay?: string;

  /**  */
  birthYear?: string;

  /**  */
  emailAddress?: string;

  /**  */
  noEmail?: boolean;

  /**  */
  phoneNumber?: string;

  /**  */
  phoneNumberType?: string;

  /**  */
  noPhone?: boolean;

  /**  */
  workInRegion?: string;
}

export interface AlternateContact {
  /**  */
  mailingAddress: Address;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  type?: string;

  /**  */
  otherType?: string;

  /**  */
  firstName?: string;

  /**  */
  lastName?: string;

  /**  */
  agency?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  emailAddress?: string;
}

export interface Accessibility {
  /**  */
  mobility?: boolean;

  /**  */
  vision?: boolean;

  /**  */
  hearing?: boolean;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface Demographics {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  ethnicity?: string;

  /**  */
  gender?: string;

  /**  */
  sexualOrientation?: string;

  /**  */
  howDidYouHear: string[];

  /**  */
  race?: string;
}

export interface HouseholdMember {
  /**  */
  address: Address;

  /**  */
  workAddress: Address;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  orderId?: number;

  /**  */
  firstName?: string;

  /**  */
  middleName?: string;

  /**  */
  lastName?: string;

  /**  */
  birthMonth?: string;

  /**  */
  birthDay?: string;

  /**  */
  birthYear?: string;

  /**  */
  emailAddress?: string;

  /**  */
  noEmail?: boolean;

  /**  */
  phoneNumber?: string;

  /**  */
  phoneNumberType?: string;

  /**  */
  noPhone?: boolean;

  /**  */
  sameAddress?: string;

  /**  */
  relationship?: string;

  /**  */
  workInRegion?: string;
}

export interface ApplicationPreferences {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  liveIn: boolean;

  /**  */
  none: boolean;

  /**  */
  workIn: boolean;
}

export interface Application {
  /**  */
  incomePeriod?: IncomePeriod;

  /**  */
  status: ApplicationStatus;

  /**  */
  language?: Language;

  /**  */
  submissionType: ApplicationSubmissionType;

  /**  */
  listing: Id;

  /**  */
  applicant: Applicant;

  /**  */
  mailingAddress: Address;

  /**  */
  alternateAddress: Address;

  /**  */
  alternateContact: AlternateContact;

  /**  */
  accessibility: Accessibility;

  /**  */
  demographics: Demographics;

  /**  */
  householdMembers: HouseholdMember[];

  /**  */
  preferences: ApplicationPreferences;

  /**  */
  applicationFlaggedSets: Id[];

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  deletedAt?: Date;

  /**  */
  appUrl?: string;

  /**  */
  additionalPhone?: boolean;

  /**  */
  additionalPhoneNumber?: string;

  /**  */
  additionalPhoneNumberType?: string;

  /**  */
  contactPreferences: string[];

  /**  */
  householdSize?: number;

  /**  */
  housingStatus?: string;

  /**  */
  sendMailToMailingAddress?: boolean;

  /**  */
  incomeVouchers?: boolean;

  /**  */
  income?: string;

  /**  */
  preferredUnit: string[];

  /**  */
  acceptedTerms?: boolean;

  /**  */
  submissionDate?: Date;
}

export interface PaginationMeta {
  /**  */
  currentPage: number;

  /**  */
  itemCount: number;

  /**  */
  itemsPerPage: number;

  /**  */
  totalItems: number;

  /**  */
  totalPages: number;
}

export interface PaginatedApplication {
  /**  */
  items: Application[];

  /**  */
  meta: PaginationMeta;
}

export interface ApplicantCreate {
  /**  */
  address: AddressCreate;

  /**  */
  workAddress: AddressCreate;

  /**  */
  firstName?: string;

  /**  */
  middleName?: string;

  /**  */
  lastName?: string;

  /**  */
  birthMonth?: string;

  /**  */
  birthDay?: string;

  /**  */
  birthYear?: string;

  /**  */
  emailAddress?: string;

  /**  */
  noEmail?: boolean;

  /**  */
  phoneNumber?: string;

  /**  */
  phoneNumberType?: string;

  /**  */
  noPhone?: boolean;

  /**  */
  workInRegion?: string;
}

export interface AlternateContactCreate {
  /**  */
  mailingAddress: AddressCreate;

  /**  */
  type?: string;

  /**  */
  otherType?: string;

  /**  */
  firstName?: string;

  /**  */
  lastName?: string;

  /**  */
  agency?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  emailAddress?: string;
}

export interface AccessibilityCreate {
  /**  */
  mobility?: boolean;

  /**  */
  vision?: boolean;

  /**  */
  hearing?: boolean;
}

export interface DemographicsCreate {
  /**  */
  ethnicity?: string;

  /**  */
  gender?: string;

  /**  */
  sexualOrientation?: string;

  /**  */
  howDidYouHear: string[];

  /**  */
  race?: string;
}

export interface HouseholdMemberCreate {
  /**  */
  address: AddressCreate;

  /**  */
  workAddress: AddressCreate;

  /**  */
  orderId?: number;

  /**  */
  firstName?: string;

  /**  */
  middleName?: string;

  /**  */
  lastName?: string;

  /**  */
  birthMonth?: string;

  /**  */
  birthDay?: string;

  /**  */
  birthYear?: string;

  /**  */
  emailAddress?: string;

  /**  */
  noEmail?: boolean;

  /**  */
  phoneNumber?: string;

  /**  */
  phoneNumberType?: string;

  /**  */
  noPhone?: boolean;

  /**  */
  sameAddress?: string;

  /**  */
  relationship?: string;

  /**  */
  workInRegion?: string;
}

export interface ApplicationPreferencesCreate {
  /**  */
  liveIn: boolean;

  /**  */
  none: boolean;

  /**  */
  workIn: boolean;
}

export interface ApplicationCreate {
  /**  */
  incomePeriod?: IncomePeriod;

  /**  */
  status: ApplicationStatus;

  /**  */
  language?: Language;

  /**  */
  submissionType: ApplicationSubmissionType;

  /**  */
  listing: Id;

  /**  */
  applicant: ApplicantCreate;

  /**  */
  mailingAddress: AddressCreate;

  /**  */
  alternateAddress: AddressCreate;

  /**  */
  alternateContact: AlternateContactCreate;

  /**  */
  accessibility: AccessibilityCreate;

  /**  */
  demographics: DemographicsCreate;

  /**  */
  householdMembers: HouseholdMemberCreate[];

  /**  */
  preferences: ApplicationPreferencesCreate;

  /**  */
  appUrl?: string;

  /**  */
  additionalPhone?: boolean;

  /**  */
  additionalPhoneNumber?: string;

  /**  */
  additionalPhoneNumberType?: string;

  /**  */
  contactPreferences: string[];

  /**  */
  householdSize?: number;

  /**  */
  housingStatus?: string;

  /**  */
  sendMailToMailingAddress?: boolean;

  /**  */
  incomeVouchers?: boolean;

  /**  */
  income?: string;

  /**  */
  preferredUnit: string[];

  /**  */
  acceptedTerms?: boolean;

  /**  */
  submissionDate?: Date;
}

export interface ApplicantUpdate {
  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  address: AddressUpdate;

  /**  */
  workAddress: AddressUpdate;

  /**  */
  firstName?: string;

  /**  */
  middleName?: string;

  /**  */
  lastName?: string;

  /**  */
  birthMonth?: string;

  /**  */
  birthDay?: string;

  /**  */
  birthYear?: string;

  /**  */
  emailAddress?: string;

  /**  */
  noEmail?: boolean;

  /**  */
  phoneNumber?: string;

  /**  */
  phoneNumberType?: string;

  /**  */
  noPhone?: boolean;

  /**  */
  workInRegion?: string;
}

export interface AlternateContactUpdate {
  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  mailingAddress: AddressUpdate;

  /**  */
  type?: string;

  /**  */
  otherType?: string;

  /**  */
  firstName?: string;

  /**  */
  lastName?: string;

  /**  */
  agency?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  emailAddress?: string;
}

export interface AccessibilityUpdate {
  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  mobility?: boolean;

  /**  */
  vision?: boolean;

  /**  */
  hearing?: boolean;
}

export interface DemographicsUpdate {
  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  ethnicity?: string;

  /**  */
  gender?: string;

  /**  */
  sexualOrientation?: string;

  /**  */
  howDidYouHear: string[];

  /**  */
  race?: string;
}

export interface HouseholdMemberUpdate {
  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  address: AddressUpdate;

  /**  */
  workAddress: AddressUpdate;

  /**  */
  orderId?: number;

  /**  */
  firstName?: string;

  /**  */
  middleName?: string;

  /**  */
  lastName?: string;

  /**  */
  birthMonth?: string;

  /**  */
  birthDay?: string;

  /**  */
  birthYear?: string;

  /**  */
  emailAddress?: string;

  /**  */
  noEmail?: boolean;

  /**  */
  phoneNumber?: string;

  /**  */
  phoneNumberType?: string;

  /**  */
  noPhone?: boolean;

  /**  */
  sameAddress?: string;

  /**  */
  relationship?: string;

  /**  */
  workInRegion?: string;
}

export interface ApplicationPreferencesUpdate {
  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  liveIn: boolean;

  /**  */
  none: boolean;

  /**  */
  workIn: boolean;
}

export interface ApplicationUpdate {
  /**  */
  incomePeriod?: IncomePeriod;

  /**  */
  status: ApplicationStatus;

  /**  */
  language?: Language;

  /**  */
  submissionType: ApplicationSubmissionType;

  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  deletedAt?: Date;

  /**  */
  listing: Id;

  /**  */
  applicant: ApplicantUpdate;

  /**  */
  mailingAddress: AddressUpdate;

  /**  */
  alternateAddress: AddressUpdate;

  /**  */
  alternateContact: AlternateContactUpdate;

  /**  */
  accessibility: AccessibilityUpdate;

  /**  */
  demographics: DemographicsUpdate;

  /**  */
  householdMembers: HouseholdMemberUpdate[];

  /**  */
  preferences: ApplicationPreferencesUpdate;

  /**  */
  appUrl?: string;

  /**  */
  additionalPhone?: boolean;

  /**  */
  additionalPhoneNumber?: string;

  /**  */
  additionalPhoneNumberType?: string;

  /**  */
  contactPreferences: string[];

  /**  */
  householdSize?: number;

  /**  */
  housingStatus?: string;

  /**  */
  sendMailToMailingAddress?: boolean;

  /**  */
  incomeVouchers?: boolean;

  /**  */
  income?: string;

  /**  */
  preferredUnit: string[];

  /**  */
  acceptedTerms?: boolean;

  /**  */
  submissionDate?: Date;
}

export interface UnitCreate {
  /**  */
  amiChart: CombinedAmiChartTypes;

  /**  */
  amiPercentage?: string;

  /**  */
  annualIncomeMin?: string;

  /**  */
  monthlyIncomeMin?: string;

  /**  */
  floor?: number;

  /**  */
  annualIncomeMax?: string;

  /**  */
  maxOccupancy?: number;

  /**  */
  minOccupancy?: number;

  /**  */
  monthlyRent?: string;

  /**  */
  numBathrooms?: number;

  /**  */
  numBedrooms?: number;

  /**  */
  number?: string;

  /**  */
  priorityType?: string;

  /**  */
  reservedType?: string;

  /**  */
  sqFeet?: string;

  /**  */
  status?: string;

  /**  */
  unitType?: string;

  /**  */
  monthlyRentAsPercentOfIncome?: string;

  /**  */
  bmrProgramChart?: boolean;
}

export interface UnitUpdate {
  /**  */
  amiChart: CombinedAmiChartTypes;

  /**  */
  amiPercentage?: string;

  /**  */
  annualIncomeMin?: string;

  /**  */
  monthlyIncomeMin?: string;

  /**  */
  floor?: number;

  /**  */
  annualIncomeMax?: string;

  /**  */
  maxOccupancy?: number;

  /**  */
  minOccupancy?: number;

  /**  */
  monthlyRent?: string;

  /**  */
  numBathrooms?: number;

  /**  */
  numBedrooms?: number;

  /**  */
  number?: string;

  /**  */
  priorityType?: string;

  /**  */
  reservedType?: string;

  /**  */
  sqFeet?: string;

  /**  */
  status?: string;

  /**  */
  unitType?: string;

  /**  */
  monthlyRentAsPercentOfIncome?: string;

  /**  */
  bmrProgramChart?: boolean;

  /**  */
  id: string;
}

export interface PropertyCreate {
  /**  */
  buildingAddress: AddressUpdate;

  /**  */
  units: UnitCreate[];

  /**  */
  accessibility: string;

  /**  */
  amenities: string;

  /**  */
  buildingTotalUnits: number;

  /**  */
  developer: string;

  /**  */
  householdSizeMax: number;

  /**  */
  householdSizeMin: number;

  /**  */
  neighborhood: string;

  /**  */
  petPolicy: string;

  /**  */
  smokingPolicy: string;

  /**  */
  unitsAvailable: number;

  /**  */
  unitAmenities: string;

  /**  */
  yearBuilt: number;
}

export interface PropertyUpdate {
  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  buildingAddress: AddressUpdate;

  /**  */
  units: UnitUpdate[];

  /**  */
  accessibility: string;

  /**  */
  amenities: string;

  /**  */
  buildingTotalUnits: number;

  /**  */
  developer: string;

  /**  */
  householdSizeMax: number;

  /**  */
  householdSizeMin: number;

  /**  */
  neighborhood: string;

  /**  */
  petPolicy: string;

  /**  */
  smokingPolicy: string;

  /**  */
  unitsAvailable: number;

  /**  */
  unitAmenities: string;

  /**  */
  yearBuilt: number;
}

export interface PropertyGroup {
  /**  */
  properties: Id[];

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  name: string;
}

export interface PropertyGroupCreate {
  /**  */
  name: string;

  /**  */
  properties: Id[];
}

export interface PropertyGroupUpdate {
  /**  */
  name: string;

  /**  */
  properties: Id[];

  /**  */
  id: string;
}

export interface AmiChartItemCreate {
  /**  */
  percentOfAmi: number;

  /**  */
  householdSize: number;

  /**  */
  income: number;
}

export interface AmiChartCreate {
  /**  */
  items: AmiChartItemCreate[];

  /**  */
  name: string;
}

export interface AmiChartItemUpdate {
  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  percentOfAmi: number;

  /**  */
  householdSize: number;

  /**  */
  income: number;
}

export interface AmiChartUpdate {
  /**  */
  id?: string;

  /**  */
  createdAt?: Date;

  /**  */
  updatedAt?: Date;

  /**  */
  items: AmiChartItemUpdate[];

  /**  */
  name: string;
}

export interface Preference {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

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

export interface ApplicationMethod {
  /**  */
  type: ApplicationMethodType;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  label: string;

  /**  */
  externalReference: string;

  /**  */
  acceptsPostmarkedApplications: boolean;

  /**  */
  listing: Listing;
}

export interface Asset {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  label: string;

  /**  */
  fileId: string;

  /**  */
  listing: CombinedListingTypes;
}

export interface ListingEvent {
  /**  */
  type: ListingEventType;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  startTime: Date;

  /**  */
  endTime: Date;

  /**  */
  url?: string;

  /**  */
  note?: string;

  /**  */
  listing: Listing;
}

export interface AmiChartItem {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  amiChart: AmiChart;

  /**  */
  percentOfAmi: number;

  /**  */
  householdSize: number;

  /**  */
  income: number;
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
  units: Unit[];

  /**  */
  name: string;
}

export interface Unit {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  amiChart: CombinedAmiChartTypes;

  /**  */
  amiPercentage?: string;

  /**  */
  annualIncomeMin?: string;

  /**  */
  monthlyIncomeMin?: string;

  /**  */
  floor?: number;

  /**  */
  annualIncomeMax?: string;

  /**  */
  maxOccupancy?: number;

  /**  */
  minOccupancy?: number;

  /**  */
  monthlyRent?: string;

  /**  */
  numBathrooms?: number;

  /**  */
  numBedrooms?: number;

  /**  */
  number?: string;

  /**  */
  priorityType?: string;

  /**  */
  reservedType?: string;

  /**  */
  sqFeet?: string;

  /**  */
  status?: string;

  /**  */
  unitType?: string;

  /**  */
  monthlyRentAsPercentOfIncome?: string;

  /**  */
  property: Property;

  /**  */
  bmrProgramChart?: boolean;
}

export interface PropertyGroup {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  name: string;

  /**  */
  properties: Property[];
}

export interface Address {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  placeName?: string;

  /**  */
  city?: string;

  /**  */
  county?: string;

  /**  */
  state?: string;

  /**  */
  street?: string;

  /**  */
  street2?: string;

  /**  */
  zipCode?: string;

  /**  */
  latitude?: number;

  /**  */
  longitude?: number;
}

export interface Property {
  /**  */
  unitsSummarized: UnitsSummarized;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  units: Unit[];

  /**  */
  listings: Listing[];

  /**  */
  propertyGroups: PropertyGroup[];

  /**  */
  accessibility: string;

  /**  */
  amenities: string;

  /**  */
  buildingAddress: Address;

  /**  */
  buildingTotalUnits: number;

  /**  */
  developer: string;

  /**  */
  householdSizeMax: number;

  /**  */
  householdSizeMin: number;

  /**  */
  neighborhood: string;

  /**  */
  petPolicy: string;

  /**  */
  smokingPolicy: string;

  /**  */
  unitsAvailable: number;

  /**  */
  unitAmenities: string;

  /**  */
  yearBuilt: number;
}

export interface Listing {
  /**  */
  status: ListingStatus;

  /**  */
  urlSlug: string;

  /**  */
  displayWaitlistSize: boolean;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  preferences: Preference[];

  /**  */
  applicationMethods: ApplicationMethod[];

  /**  */
  assets: Asset[];

  /**  */
  events: ListingEvent[];

  /**  */
  property: Property;

  /**  */
  applications: Application[];

  /**  */
  applicationDueDate: Date;

  /**  */
  applicationOpenDate: Date;

  /**  */
  applicationFee: string;

  /**  */
  applicationOrganization: string;

  /**  */
  applicationAddress: CombinedApplicationAddressTypes;

  /**  */
  applicationPickUpAddress: CombinedApplicationPickUpAddressTypes;

  /**  */
  applicationPickUpAddressOfficeHours: string;

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
  disableUnitsAccordion: boolean;

  /**  */
  leasingAgentAddress: CombinedLeasingAgentAddressTypes;

  /**  */
  leasingAgentEmail: string;

  /**  */
  leasingAgentName: string;

  /**  */
  leasingAgents?: User[];

  /**  */
  leasingAgentOfficeHours: string;

  /**  */
  leasingAgentPhone: string;

  /**  */
  leasingAgentTitle: string;

  /**  */
  name: string;

  /**  */
  postmarkedApplicationsReceivedByDate: Date;

  /**  */
  programRules: string;

  /**  */
  rentalAssistance: string;

  /**  */
  rentalHistory: string;

  /**  */
  requiredDocuments: string;

  /**  */
  waitlistCurrentSize: number;

  /**  */
  waitlistMaxSize: number;

  /**  */
  whatToExpect: CombinedWhatToExpectTypes;

  /**  */
  applicationConfig?: object;
}

export interface User {
  /**  */
  roles: UserRole[];

  /**  */
  id: string;

  /**  */
  passwordHash: string;

  /**  */
  email: string;

  /**  */
  firstName: string;

  /**  */
  middleName?: string;

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
  leasingAgentInListings?: Listing[];

  /**  */
  isAdmin: boolean;
}

export interface Applicant {
  /**  */
  firstName?: string;

  /**  */
  middleName?: string;

  /**  */
  lastName?: string;

  /**  */
  birthMonth?: string;

  /**  */
  birthDay?: string;

  /**  */
  birthYear?: string;

  /**  */
  emailAddress?: string;

  /**  */
  noEmail?: boolean;

  /**  */
  phoneNumber?: string;

  /**  */
  phoneNumberType?: string;

  /**  */
  noPhone?: boolean;

  /**  */
  workInRegion?: string;

  /**  */
  workAddress: Address;

  /**  */
  address: Address;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface AlternateContact {
  /**  */
  type?: string;

  /**  */
  otherType?: string;

  /**  */
  firstName?: string;

  /**  */
  lastName?: string;

  /**  */
  agency?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  emailAddress?: string;

  /**  */
  mailingAddress: Address;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface Accessibility {
  /**  */
  mobility?: boolean;

  /**  */
  vision?: boolean;

  /**  */
  hearing?: boolean;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface Demographics {
  /**  */
  ethnicity?: string;

  /**  */
  gender?: string;

  /**  */
  sexualOrientation?: string;

  /**  */
  howDidYouHear: string[];

  /**  */
  race?: string;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface HouseholdMember {
  /**  */
  orderId?: number;

  /**  */
  address: Address;

  /**  */
  firstName?: string;

  /**  */
  middleName?: string;

  /**  */
  lastName?: string;

  /**  */
  birthMonth?: string;

  /**  */
  birthDay?: string;

  /**  */
  birthYear?: string;

  /**  */
  emailAddress?: string;

  /**  */
  noEmail?: boolean;

  /**  */
  phoneNumber?: string;

  /**  */
  phoneNumberType?: string;

  /**  */
  noPhone?: boolean;

  /**  */
  sameAddress?: string;

  /**  */
  relationship?: string;

  /**  */
  workInRegion?: string;

  /**  */
  workAddress?: CombinedWorkAddressTypes;

  /**  */
  application: Application;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface ApplicationPreferences {
  /**  */
  liveIn: boolean;

  /**  */
  none: boolean;

  /**  */
  workIn: boolean;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface ApplicationFlaggedSet {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  rule: string;

  /**  */
  resolved: boolean;

  /**  */
  resolvedTime?: Date;

  /**  */
  resolvingUserId: User;

  /**  */
  status: EnumApplicationFlaggedSetStatus;

  /**  */
  applications: Application[];

  /**  */
  resolvedApplication: Application[];
}

export interface Application {
  /**  */
  incomePeriod?: IncomePeriod;

  /**  */
  status: ApplicationStatus;

  /**  */
  language?: Language;

  /**  */
  submissionType: ApplicationSubmissionType;

  /**  */
  deletedAt?: Date;

  /**  */
  appUrl?: string;

  /**  */
  user: CombinedUserTypes;

  /**  */
  listing: Listing;

  /**  */
  applicant: Applicant;

  /**  */
  additionalPhone?: boolean;

  /**  */
  additionalPhoneNumber?: string;

  /**  */
  additionalPhoneNumberType?: string;

  /**  */
  contactPreferences: string[];

  /**  */
  householdSize?: number;

  /**  */
  housingStatus?: string;

  /**  */
  sendMailToMailingAddress?: boolean;

  /**  */
  mailingAddress: Address;

  /**  */
  alternateAddress: Address;

  /**  */
  alternateContact: AlternateContact;

  /**  */
  accessibility: Accessibility;

  /**  */
  demographics: Demographics;

  /**  */
  incomeVouchers?: boolean;

  /**  */
  income?: string;

  /**  */
  householdMembers: HouseholdMember[];

  /**  */
  preferredUnit: string[];

  /**  */
  preferences: ApplicationPreferences;

  /**  */
  acceptedTerms?: boolean;

  /**  */
  submissionDate?: Date;

  /**  */
  applicationFlaggedSets: ApplicationFlaggedSet[];

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface ApplicationFlaggedSet {
  /**  */
  resolvingUserId: User;

  /**  */
  primaryApplicant: Applicant;

  /**  */
  applications: Application[];

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  rule: string;

  /**  */
  resolved: boolean;

  /**  */
  resolvedTime?: Date;

  /**  */
  status: EnumApplicationFlaggedSetStatus;

  /**  */
  resolvedApplication: Application[];
}

export interface PaginatedApplicationFlaggedSet {
  /**  */
  items: ApplicationFlaggedSet[];

  /**  */
  meta: PaginationMeta;
}

export enum UserRole {
  'user' = 'user',
  'admin' = 'admin'
}

export enum ListingStatus {
  'active' = 'active',
  'pending' = 'pending'
}

export enum ApplicationMethodType {
  'Internal' = 'Internal',
  'FileDownload' = 'FileDownload',
  'ExternalLink' = 'ExternalLink',
  'PaperPickup' = 'PaperPickup',
  'POBox' = 'POBox',
  'LeasingAgent' = 'LeasingAgent'
}
export type CombinedAmiChartTypes = (AmiChart & any) | null;
export enum ListingEventType {
  'openHouse' = 'openHouse',
  'publicLottery' = 'publicLottery'
}
export type CombinedApplicationAddressTypes = (Address & any) | null;
export type CombinedApplicationPickUpAddressTypes = (Address & any) | null;
export type CombinedLeasingAgentAddressTypes = (Address & any) | null;
export type CombinedWhatToExpectTypes = (WhatToExpect & any) | null;
export enum IncomePeriod {
  'perMonth' = 'perMonth',
  'perYear' = 'perYear'
}

export enum ApplicationStatus {
  'draft' = 'draft',
  'submitted' = 'submitted',
  'removed' = 'removed'
}

export enum Language {
  'en' = 'en',
  'es' = 'es'
}

export enum ApplicationSubmissionType {
  'paper' = 'paper',
  'electronical' = 'electronical'
}
export type CombinedListingTypes = (Listing & any) | null;
export type CombinedWorkAddressTypes = (Address & any) | null;
export enum EnumApplicationFlaggedSetStatus {
  'flagged' = 'flagged',
  'resolved' = 'resolved'
}
export type CombinedUserTypes = (User & any) | null;
export enum EnumApplicationFlaggedSetStatus {
  'flagged' = 'flagged',
  'resolved' = 'resolved'
}
