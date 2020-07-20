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
const basePath = '';

export class ApplicationsService {
  /**
   * List applications
   */
  static list(
    params: {
      /**  */
      listingId?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications';

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
  static create(
    params: {
      /** requestBody */
      body?: ApplicationCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;
      axios(configs, resolve, reject);
    });
  }
  /**
   * Get application by id
   */
  static retrieve(
    params: {
      /**  */
      applicationId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationDto> {
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
  static update(
    params: {
      /**  */
      applicationId: string;
      /** requestBody */
      body?: ApplicationUpdateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationDto> {
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
  static delete(
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

export interface Preference {
  /**  */
  id: string;

  /**  */
  ordinal: string;

  /**  */
  title: string;

  /**  */
  subtitle: string;

  /**  */
  description: string;

  /**  */
  links: object[];

  /**  */
  listing: Listing;
}

export interface Unit {
  /**  */
  id: string;

  /**  */
  amiPercentage: string;

  /**  */
  annualIncomeMin: string;

  /**  */
  monthlyIncomeMin: number;

  /**  */
  floor: number;

  /**  */
  annualIncomeMax: string;

  /**  */
  maxOccupancy: number;

  /**  */
  minOccupancy: number;

  /**  */
  monthlyRent: number;

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
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  amiChartId: number;

  /**  */
  monthlyRentAsPercentOfIncome: number;

  /**  */
  listing: Listing;
}

export interface Attachment {
  /**  */
  id: string;

  /**  */
  label: string;

  /**  */
  fileUrl: string;

  /**  */
  type: EnumAttachmentType;

  /**  */
  listing: Listing;
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
}

export interface Application {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  user: User;

  /**  */
  listing: Listing;

  /**  */
  application: object;
}

export interface Listing {
  /**  */
  preferences: Preference[];

  /**  */
  units: Unit[];

  /**  */
  attachments: Attachment[];

  /**  */
  id: string;

  /**  */
  acceptingApplicationsAtLeasingAgent: boolean;

  /**  */
  acceptingApplicationsByPoBox: boolean;

  /**  */
  acceptingOnlineApplications: boolean;

  /**  */
  acceptsPostmarkedApplications: boolean;

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
  applicationAddress: object;

  /**  */
  blankPaperApplicationCanBePickedUp: boolean;

  /**  */
  buildingAddress: object;

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
  leasingAgentAddress: object;

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
  whatToExpect: object;

  /**  */
  yearBuilt: number;

  /**  */
  unitsSummarized: object;

  /**  */
  urlSlug: string;

  /**  */
  applications: Application[];
}

export interface ListingsListResponse {
  /**  */
  status: EnumListingsListResponseStatus;

  /**  */
  listings: Listing[];

  /**  */
  amiCharts: object;
}

export interface IdDto {
  /**  */
  id: string;
}

export interface ApplicationDto {
  /**  */
  id: string;

  /**  */
  application: object;

  /**  */
  user: IdDto;

  /**  */
  listing: IdDto;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface ApplicationCreateDto {
  /**  */
  application: object;

  /**  */
  listing: IdDto;

  /**  */
  user: IdDto;
}

export interface ApplicationUpdateDto {
  /**  */
  application: object;

  /**  */
  listing: IdDto;

  /**  */
  user: IdDto;

  /**  */
  id: string;
}
export enum EnumAttachmentType {
  'ApplicationDownload' = 'ApplicationDownload',
  'ExternalApplication' = 'ExternalApplication'
}
export enum EnumListingsListResponseStatus {
  'ok' = 'ok'
}
