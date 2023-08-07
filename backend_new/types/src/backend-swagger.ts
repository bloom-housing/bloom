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

export class RootService {
  /**
   * Health check endpoint
   */
  healthCheck(options: IRequestOptions = {}): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/';

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
}

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
  /**
   * Get listings by multiselect question id
   */
  retrieveListings(
    params: {
      /**  */
      multiselectQuestionId: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<IdDTO[]> {
    return new Promise((resolve, reject) => {
      let url =
        basePath + '/listings/byMultiselectQuestion/{multiselectQuestionId}';
      url = url.replace(
        '{multiselectQuestionId}',
        params['multiselectQuestionId'] + '',
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
      body?: UnitAccessibilityPriorityTypeUpdate;
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
      body?: UnitRentTypeUpdate;
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

export class JurisdictionsService {
  /**
   * List jurisdictions
   */
  list(options: IRequestOptions = {}): Promise<Jurisdiction[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/jurisdictions';

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
   * Create jurisdiction
   */
  create(
    params: {
      /** requestBody */
      body?: JurisdictionCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<Jurisdiction> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/jurisdictions';

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
   * Delete jurisdiction by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/jurisdictions';

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
   * Get jurisdiction by id
   */
  retrieve(
    params: {
      /**  */
      jurisdictionId: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<Jurisdiction> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/jurisdictions/{jurisdictionId}';
      url = url.replace('{jurisdictionId}', params['jurisdictionId'] + '');

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
   * Update jurisdiction
   */
  update(
    params: {
      /** requestBody */
      body?: JurisdictionUpdate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<Jurisdiction> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/jurisdictions/{jurisdictionId}';

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
  /**
   * Get jurisdiction by name
   */
  retrieveByName(
    params: {
      /**  */
      jurisdictionName: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<Jurisdiction> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/jurisdictions/byName/{jurisdictionName}';
      url = url.replace('{jurisdictionName}', params['jurisdictionName'] + '');

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
}

export class MultiselectQuestionsService {
  /**
   * List multiselect questions
   */
  list(
    params: {
      /**  */
      $comparison: string;
      /**  */
      jurisdiction?: string;
      /**  */
      applicationSection?: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<MultiselectQuestion[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/multiselectQuestions';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );
      configs.params = {
        $comparison: params['$comparison'],
        jurisdiction: params['jurisdiction'],
        applicationSection: params['applicationSection'],
      };

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Create multiselect question
   */
  create(
    params: {
      /** requestBody */
      body?: MultiselectQuestionCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<MultiselectQuestion> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/multiselectQuestions';

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
   * Delete multiselect question by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/multiselectQuestions';

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
   * Get multiselect question by id
   */
  retrieve(
    params: {
      /**  */
      multiselectQuestionId: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<MultiselectQuestion> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/multiselectQuestions/{multiselectQuestionId}';
      url = url.replace(
        '{multiselectQuestionId}',
        params['multiselectQuestionId'] + '',
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
   * Update multiselect question
   */
  update(
    params: {
      /** requestBody */
      body?: MultiselectQuestionUpdate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<MultiselectQuestion> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/multiselectQuestions/{multiselectQuestionId}';

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

export class ApplicationsService {
  /**
   * Get a paginated set of applications
   */
  list(
    params: {
      /**  */
      page?: number;
      /**  */
      limit?: number | 'all';
      /**  */
      listingId?: string;
      /**  */
      search?: string;
      /**  */
      userId?: string;
      /**  */
      orderBy?: ApplicationOrderByKeys;
      /**  */
      order?: OrderByEnum;
      /**  */
      markedAsDuplicate?: boolean;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<PaginatedApplication> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );
      configs.params = {
        page: params['page'],
        limit: params['limit'],
        listingId: params['listingId'],
        search: params['search'],
        userId: params['userId'],
        orderBy: params['orderBy'],
        order: params['order'],
        markedAsDuplicate: params['markedAsDuplicate'],
      };

      /** 适配ios13，get请求不允许带body */

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
    options: IRequestOptions = {},
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications/{applicationId}';
      url = url.replace('{applicationId}', params['applicationId'] + '');

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
}

export interface SuccessDTO {
  /**  */
  success: boolean;
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

export interface IdDTO {
  /**  */
  id: string;

  /**  */
  name?: string;
}

export interface MultiselectLink {
  /**  */
  title: string;

  /**  */
  url: string;
}

export interface MultiselectOption {
  /**  */
  text: string;

  /**  */
  untranslatedText: string;

  /**  */
  ordinal: number;

  /**  */
  description: string;

  /**  */
  links: MultiselectLink[];

  /**  */
  collectAddress: boolean;

  /**  */
  exclusive: boolean;
}

export interface MultiselectQuestion {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  text: string;

  /**  */
  untranslatedText: string;

  /**  */
  untranslatedOptOutText: string;

  /**  */
  subText: string;

  /**  */
  description: string;

  /**  */
  links: MultiselectLink[];

  /**  */
  jurisdictions: IdDTO[];

  /**  */
  options: MultiselectOption[];

  /**  */
  optOutText: string;

  /**  */
  hideFromListing: boolean;

  /**  */
  applicationSection: MultiselectQuestionsApplicationSectionEnum;
}

export interface ListingMultiselectQuestion {
  /**  */
  multiselectQuestions: MultiselectQuestion;

  /**  */
  ordinal: number;
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

export interface Asset {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface Address {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface Jurisdiction {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  name: string;

  /**  */
  notificationsSignUpUrl: string;

  /**  */
  languages: string[];

  /**  */
  multiselectQuestions: string[];

  /**  */
  partnerTerms: string;

  /**  */
  publicUrl: string;

  /**  */
  emailFromAddress: string;

  /**  */
  rentalAssistanceDefault: string;

  /**  */
  enablePartnerSettings: boolean;

  /**  */
  enableAccessibilityFeatures: boolean;

  /**  */
  enableUtilitiesIncluded: boolean;
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

export interface ListingImage {}

export interface ListingFeatures {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface ListingUtilities {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
}

export interface Unit {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;
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

  /**  */
  name: UnitAccessibilityPriorityTypeEnum;
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

export interface UnitsSummary {}

export interface ListingGet {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  additionalApplicationSubmissionNotes: string;

  /**  */
  digitalApplication: boolean;

  /**  */
  commonDigitalApplication: boolean;

  /**  */
  paperApplication: boolean;

  /**  */
  referralOpportunity: boolean;

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
  servicesOffered: string;

  /**  */
  yearBuilt: number;

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
  applicationPickUpAddressType: ApplicationAddressTypeEnum;

  /**  */
  applicationDropOffAddressOfficeHours: string;

  /**  */
  applicationDropOffAddressType: ApplicationAddressTypeEnum;

  /**  */
  applicationMailingAddressType: ApplicationAddressTypeEnum;

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
  depositHelperText: string;

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
  specialNotes: string;

  /**  */
  waitlistCurrentSize: number;

  /**  */
  waitlistMaxSize: number;

  /**  */
  whatToExpect: string;

  /**  */
  status: ListingsStatusEnum;

  /**  */
  reviewOrderType: ReviewOrderTypeEnum;

  /**  */
  applicationConfig: object;

  /**  */
  displayWaitlistSize: boolean;

  /**  */
  showWaitlist: boolean;

  /**  */
  reservedCommunityDescription: string;

  /**  */
  reservedCommunityMinAge: number;

  /**  */
  resultLink: string;

  /**  */
  isWaitlistOpen: boolean;

  /**  */
  waitlistOpenSpots: number;

  /**  */
  customMapPin: boolean;

  /**  */
  publishedAt: Date;

  /**  */
  closedAt: Date;

  /**  */
  afsLastRunAt: Date;

  /**  */
  lastApplicationUpdateAt: Date;

  /**  */
  listingMultiselectQuestions: ListingMultiselectQuestion[];

  /**  */
  applicationMethods: ApplicationMethod[];

  /**  */
  referralApplication?: ApplicationMethod;

  /**  */
  assets: Asset[];

  /**  */
  events: Asset[];

  /**  */
  listingsBuildingAddress: Address;

  /**  */
  listingsApplicationPickUpAddress: Address;

  /**  */
  listingsApplicationDropOffAddress: Address;

  /**  */
  listingsApplicationMailingAddress: Address;

  /**  */
  listingsLeasingAgentAddress: Address;

  /**  */
  listingsBuildingSelectionCriteriaFile: Asset;

  /**  */
  jurisdictions: Jurisdiction;

  /**  */
  listingsResult: Asset;

  /**  */
  reservedCommunityTypes: ReservedCommunityType;

  /**  */
  listingImages: ListingImage[];

  /**  */
  listingFeatures: ListingFeatures;

  /**  */
  listingUtilities: ListingUtilities;

  /**  */
  units: Unit[];

  /**  */
  unitsSummarized: UnitsSummarized;

  /**  */
  unitsSummary: UnitsSummary[];
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

export interface UnitAccessibilityPriorityTypeCreate {
  /**  */
  name: UnitAccessibilityPriorityTypeEnum;
}

export interface UnitAccessibilityPriorityTypeUpdate {
  /**  */
  id: string;

  /**  */
  name: UnitAccessibilityPriorityTypeEnum;
}

export interface UnitRentTypeCreate {
  /**  */
  name: UnitRentTypeEnum;
}

export interface UnitRentTypeUpdate {
  /**  */
  id: string;

  /**  */
  name: UnitRentTypeEnum;
}

export interface UnitRentType {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  name: UnitRentTypeEnum;
}

export interface JurisdictionCreate {
  /**  */
  name: string;

  /**  */
  notificationsSignUpUrl: string;

  /**  */
  languages: string[];

  /**  */
  partnerTerms: string;

  /**  */
  publicUrl: string;

  /**  */
  emailFromAddress: string;

  /**  */
  rentalAssistanceDefault: string;

  /**  */
  enablePartnerSettings: boolean;

  /**  */
  enableAccessibilityFeatures: boolean;

  /**  */
  enableUtilitiesIncluded: boolean;
}

export interface JurisdictionUpdate {
  /**  */
  id: string;

  /**  */
  name: string;

  /**  */
  notificationsSignUpUrl: string;

  /**  */
  languages: string[];

  /**  */
  partnerTerms: string;

  /**  */
  publicUrl: string;

  /**  */
  emailFromAddress: string;

  /**  */
  rentalAssistanceDefault: string;

  /**  */
  enablePartnerSettings: boolean;

  /**  */
  enableAccessibilityFeatures: boolean;

  /**  */
  enableUtilitiesIncluded: boolean;
}

export interface MultiselectQuestionCreate {
  /**  */
  text: string;

  /**  */
  untranslatedOptOutText: string;

  /**  */
  subText: string;

  /**  */
  description: string;

  /**  */
  links: MultiselectLink[];

  /**  */
  jurisdictions: IdDTO[];

  /**  */
  options: MultiselectOption[];

  /**  */
  optOutText: string;

  /**  */
  hideFromListing: boolean;

  /**  */
  applicationSection: MultiselectQuestionsApplicationSectionEnum;
}

export interface MultiselectQuestionUpdate {
  /**  */
  id: string;

  /**  */
  text: string;

  /**  */
  untranslatedOptOutText: string;

  /**  */
  subText: string;

  /**  */
  description: string;

  /**  */
  links: MultiselectLink[];

  /**  */
  jurisdictions: IdDTO[];

  /**  */
  options: MultiselectOption[];

  /**  */
  optOutText: string;

  /**  */
  hideFromListing: boolean;

  /**  */
  applicationSection: MultiselectQuestionsApplicationSectionEnum;
}

export interface MultiselectQuestionFilterParams {
  /**  */
  $comparison: EnumMultiselectQuestionFilterParamsComparison;

  /**  */
  jurisdiction?: string;

  /**  */
  applicationSection?: string;
}

export interface MultiselectQuestionQueryParams {
  /**  */
  filter?: MultiselectQuestionFilterParams[];
}

export interface Accessibility {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  mobility: boolean;

  /**  */
  vision: boolean;

  /**  */
  hearing: boolean;
}

export interface Demographic {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  ethnicity: string;

  /**  */
  gender: string;

  /**  */
  sexualOrientation: string;

  /**  */
  howDidYouHear: string[];

  /**  */
  race: string[];
}

export interface Applicant {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  firstName: string;

  /**  */
  middleName: string;

  /**  */
  lastName: string;

  /**  */
  birthMonth: string;

  /**  */
  birthDay: string;

  /**  */
  birthYear: string;

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
  workInRegion: YesNoEnum;

  /**  */
  applicantWorkAddress: Address;

  /**  */
  applicantAddress: Address;
}

export interface AlternateContact {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

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
  address: Address;
}

export interface Application {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  deletedAt: Date;

  /**  */
  appUrl: string;

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
  householdExpectingChanges: boolean;

  /**  */
  householdStudent: boolean;

  /**  */
  incomeVouchers: boolean;

  /**  */
  income: string;

  /**  */
  incomePeriod: IncomePeriodEnum;

  /**  */
  status: ApplicationStatusEnum;

  /**  */
  language: LanguagesEnum;

  /**  */
  acceptedTerms: boolean;

  /**  */
  submissionType: ApplicationSubmissionTypeEnum;

  /**  */
  submissionDate: Date;

  /**  */
  markedAsDuplicate: boolean;

  /**  */
  flagged: boolean;

  /**  */
  confirmationCode: string;

  /**  */
  reviewStatus: ApplicationReviewStatusEnum;

  /**  */
  applicationsMailingAddress: Address;

  /**  */
  applicationsAlternateAddress: Address;

  /**  */
  accessibility: Accessibility;

  /**  */
  demographics: Demographic;

  /**  */
  preferredUnitTypes: string[];

  /**  */
  applicant: Applicant;

  /**  */
  alternateContact: AlternateContact;

  /**  */
  householdMember: string[];

  /**  */
  preferences: string[];

  /**  */
  programs: string[];
}

export interface PaginatedApplication {
  /**  */
  items: Application[];
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

export enum MultiselectQuestionsApplicationSectionEnum {
  'programs' = 'programs',
  'preferences' = 'preferences',
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

export enum UnitAccessibilityPriorityTypeEnum {
  'mobility' = 'mobility',
  'mobilityAndHearing' = 'mobilityAndHearing',
  'hearing' = 'hearing',
  'visual' = 'visual',
  'hearingAndVisual' = 'hearingAndVisual',
  'mobilityAndVisual' = 'mobilityAndVisual',
  'mobilityHearingAndVisual' = 'mobilityHearingAndVisual',
}

export enum UnitRentTypeEnum {
  'fixed' = 'fixed',
  'percentageOfIncome' = 'percentageOfIncome',
}
export enum EnumMultiselectQuestionFilterParamsComparison {
  '=' = '=',
  '<>' = '<>',
  'IN' = 'IN',
  '>=' = '>=',
  '<=' = '<=',
  'NA' = 'NA',
}
export enum ApplicationOrderByKeys {
  'firstName' = 'firstName',
  'lastName' = 'lastName',
  'submissionDate' = 'submissionDate',
  'createdAt' = 'createdAt',
}

export enum OrderByEnum {
  'asc' = 'asc',
  'desc' = 'desc',
}

export enum IncomePeriodEnum {
  'perMonth' = 'perMonth',
  'perYear' = 'perYear',
}

export enum ApplicationStatusEnum {
  'draft' = 'draft',
  'submitted' = 'submitted',
  'removed' = 'removed',
}

export enum LanguagesEnum {
  'en' = 'en',
  'es' = 'es',
  'vi' = 'vi',
  'zh' = 'zh',
  'tl' = 'tl',
}

export enum ApplicationSubmissionTypeEnum {
  'paper' = 'paper',
  'electronical' = 'electronical',
}

export enum ApplicationReviewStatusEnum {
  'pending' = 'pending',
  'pendingAndValid' = 'pendingAndValid',
  'valid' = 'valid',
  'duplicate' = 'duplicate',
}

export enum YesNoEnum {
  'yes' = 'yes',
  'no' = 'no',
}