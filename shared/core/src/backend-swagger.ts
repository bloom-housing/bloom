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
  ): Promise<ListingExtended> {
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
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedApplication> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { page: params['page'], limit: params['limit'], listingId: params['listingId'] };
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
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications/csv';

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

export interface User {
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
  id: string;

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
  sqFeet: string;

  /**  */
  status: string;

  /**  */
  unitType: string;

  /**  */
  amiChartId: number;

  /**  */
  monthlyRentAsPercentOfIncome: string;

  /**  */
  bmrProgramChart?: boolean;
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

export interface Address {
  /**  */
  placeName?: string;

  /**  */
  city: string;

  /**  */
  county?: string;

  /**  */
  state: string;

  /**  */
  street: string;

  /**  */
  street2?: string;

  /**  */
  zipCode: string;

  /**  */
  latitude?: number;

  /**  */
  longitude?: number;
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
  unitsSummarized: UnitsSummarized;

  /**  */
  urlSlug: string;

  /**  */
  applicationMethods: ApplicationMethod[];

  /**  */
  assets: Asset[];

  /**  */
  preferences: Preference[];

  /**  */
  units: Unit[];

  /**  */
  events: ListingEvent[];

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
  applicationConfig?: object;
}

export interface ListingExtended {
  /**  */
  status: ListingsResponseStatus;

  /**  */
  listings: Listing[];

  /**  */
  amiCharts: object;
}

export interface Id {
  /**  */
  id: string;
}

export interface ListingCreate {
  /**  */
  status: ListingStatus;

  /**  */
  unitsSummarized: UnitsSummarized;

  /**  */
  urlSlug: string;

  /**  */
  applicationMethods: Id[];

  /**  */
  assets: Id[];

  /**  */
  preferences: Id[];

  /**  */
  units: Id[];

  /**  */
  events: Id[];

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
  applicationConfig?: object;
}

export interface ListingUpdate {
  /**  */
  status: ListingStatus;

  /**  */
  unitsSummarized: UnitsSummarized;

  /**  */
  urlSlug: string;

  /**  */
  applicationMethods: Id[];

  /**  */
  assets: Id[];

  /**  */
  preferences: Id[];

  /**  */
  units: Id[];

  /**  */
  events: Id[];

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
  applicationConfig?: object;

  /**  */
  id: string;
}

export interface Applicant {
  /**  */
  firstName: string;

  /**  */
  middleName: string;

  /**  */
  lastName: string;

  /**  */
  birthMonth: number;

  /**  */
  birthDay: number;

  /**  */
  birthYear: number;

  /**  */
  emailAddress: string;

  /**  */
  noEmail: boolean;

  /**  */
  phoneNumber: string;

  /**  */
  phoneNumberType: string;

  /**  */
  noPhone: boolean;

  /**  */
  workInRegion: boolean;

  /**  */
  workAddress: Address;

  /**  */
  address: Address;
}

export interface AlternateContact {
  /**  */
  type: string;

  /**  */
  otherType: string;

  /**  */
  firstName: string;

  /**  */
  lastName: string;

  /**  */
  agency: string;

  /**  */
  phoneNumber: string;

  /**  */
  emailAddress: string;

  /**  */
  mailingAddress: Address;
}

export interface Accessibility {
  /**  */
  mobility: boolean;

  /**  */
  vision: boolean;

  /**  */
  hearing: boolean;
}

export interface Demographics {
  /**  */
  ethnicity: string;

  /**  */
  gender: string;

  /**  */
  sexualOrientation: string;

  /**  */
  howDidYouHear: string;

  /**  */
  race: string;
}

export interface HouseholdMember {
  /**  */
  id?: number;

  /**  */
  address: Address;

  /**  */
  firstName: string;

  /**  */
  middleName: string;

  /**  */
  lastName: string;

  /**  */
  birthMonth: number;

  /**  */
  birthDay: number;

  /**  */
  birthYear: number;

  /**  */
  emailAddress: string;

  /**  */
  noEmail: boolean;

  /**  */
  phoneNumber: string;

  /**  */
  phoneNumberType: string;

  /**  */
  noPhone: boolean;

  /**  */
  sameAddress?: boolean;

  /**  */
  relationship?: string;

  /**  */
  workInRegion?: boolean;

  /**  */
  workAddress?: CombinedWorkAddressTypes;
}

export interface ApplicationData {
  /**  */
  applicant: Applicant;

  /**  */
  additionalPhone: boolean;

  /**  */
  additionalPhoneNumber: string;

  /**  */
  additionalPhoneNumberType: string;

  /**  */
  contactPreferences: string[];

  /**  */
  householdSize: number;

  /**  */
  housingStatus: string;

  /**  */
  sendMailToMailingAddress: boolean;

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
  incomeVouchers: string;

  /**  */
  income: string;

  /**  */
  incomePeriod: string;

  /**  */
  householdMembers: HouseholdMember[];

  /**  */
  preferredUnit: string[];

  /**  */
  preferences: object;
}

export interface Application {
  /**  */
  listing: Listing;

  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  appUrl: string;

  /**  */
  application: ApplicationData;
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

export interface ApplicationCreate {
  /**  */
  listing: Id;

  /**  */
  appUrl: string;

  /**  */
  application: ApplicationData;
}

export interface ApplicationUpdate {
  /**  */
  listing: Id;

  /**  */
  appUrl: string;

  /**  */
  application: ApplicationData;

  /**  */
  id: string;
}

export interface AssetCreate {
  /**  */
  label: string;

  /**  */
  fileId: string;
}

export interface AssetUpdate {
  /**  */
  label: string;

  /**  */
  fileId: string;

  /**  */
  id: string;
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

export interface ApplicationMethodUpdate {
  /**  */
  type: ApplicationMethodType;

  /**  */
  label: string;

  /**  */
  externalReference: string;

  /**  */
  acceptsPostmarkedApplications: boolean;

  /**  */
  id: string;
}

export interface UnitCreate {
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
  sqFeet: string;

  /**  */
  status: string;

  /**  */
  unitType: string;

  /**  */
  amiChartId: number;

  /**  */
  monthlyRentAsPercentOfIncome: string;

  /**  */
  bmrProgramChart?: boolean;
}

export interface UnitUpdate {
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
  sqFeet: string;

  /**  */
  status: string;

  /**  */
  unitType: string;

  /**  */
  amiChartId: number;

  /**  */
  monthlyRentAsPercentOfIncome: string;

  /**  */
  bmrProgramChart?: boolean;

  /**  */
  id: string;
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

export interface ListingEventUpdate {
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

  /**  */
  id: string;
}

export enum ListingsResponseStatus {
  'ok' = 'ok'
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

export enum ListingEventType {
  'openHouse' = 'openHouse',
  'publicLottery' = 'publicLottery'
}
export type CombinedApplicationAddressTypes = (Address & any) | null;
export type CombinedBuildingAddressTypes = (Address & any) | null;
export type CombinedLeasingAgentAddressTypes = (Address & any) | null;
export type CombinedWhatToExpectTypes = (WhatToExpect & any) | null;
export type CombinedWorkAddressTypes = (Address & any) | null;
