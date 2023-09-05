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
      orderBy?: ListingOrderByKeys[];
      /**  */
      orderDir?: OrderByEnum[];
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
   * Create listing
   */
  create(
    params: {
      /** requestBody */
      body?: ListingCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<Listing> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/listings';

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
   * Delete listing by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/listings';

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
  ): Promise<Listing> {
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
   * Update listing by id
   */
  update(
    params: {
      /**  */
      id: string;
      /** requestBody */
      body?: ListingUpdate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/listings/{id}';
      url = url.replace('{id}', params['id'] + '');

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
      applicationSection?: MultiselectQuestionsApplicationSectionEnum;
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
   * Create application (used by partners to hand create an application)
   */
  create(
    params: {
      /** requestBody */
      body?: ApplicationCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications';

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
   * Delete application by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications';

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
  /**
   * Submit application (used by applicants applying to a listing)
   */
  submit(
    params: {
      /** requestBody */
      body?: ApplicationCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications/submit';

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
   * Verify application can be saved
   */
  submissionValidation(
    params: {
      /** requestBody */
      body?: ApplicationCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications/verify';

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
   * Update application by id
   */
  update(
    params: {
      /**  */
      id: string;
      /** requestBody */
      body?: ApplicationUpdate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/applications/{id}';
      url = url.replace('{id}', params['id'] + '');

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

export class AssetsService {
  /**
   * Create presigned upload metadata
   */
  createPresignedUploadMetadata(
    params: {
      /** requestBody */
      body?: CreatePresignedUploadMetadata;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<CreatePresignedUploadMetadataResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/assets/presigned-upload-metadata';

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
}

export class UserService {
  /**
   *
   */
  userControllerProfile(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user';

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
   * Delete user by id
   */
  delete(
    params: {
      /** requestBody */
      body?: IdDTO;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user';

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
   * Creates a public only user
   */
  create(
    params: {
      /**  */
      noWelcomeEmail?: boolean;
      /** requestBody */
      body?: UserCreate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user';

      const configs: IRequestConfig = getConfigs(
        'post',
        'application/json',
        url,
        options,
      );
      configs.params = { noWelcomeEmail: params['noWelcomeEmail'] };

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   * Get a paginated set of users
   */
  list(
    params: {
      /**  */
      page?: number;
      /**  */
      limit?: number | 'all';
      /**  */
      isPortalUser?: boolean;
      /**  */
      search?: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<PaginatedUser> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/list';

      const configs: IRequestConfig = getConfigs(
        'get',
        'application/json',
        url,
        options,
      );
      configs.params = {
        page: params['page'],
        limit: params['limit'],
        isPortalUser: params['isPortalUser'],
        search: params['search'],
      };

      /** 适配ios13，get请求不允许带body */

      axios(configs, resolve, reject);
    });
  }
  /**
   * Get user by id
   */
  retrieve(
    params: {
      /**  */
      id: string;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/{id}';
      url = url.replace('{id}', params['id'] + '');

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
   * Update user
   */
  update(
    params: {
      /** requestBody */
      body?: UserUpdate;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/{id}';

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
   * Forgot Password
   */
  forgotPassword(
    params: {
      /** requestBody */
      body?: EmailAndAppUrl;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/forgot-password';

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
   * Invite partner user
   */
  invite(
    params: {
      /** requestBody */
      body?: UserInvite;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/invite';

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
   * Resend public confirmation
   */
  resendConfirmation(
    params: {
      /** requestBody */
      body?: EmailAndAppUrl;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/resend-confirmation';

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
   * Resend partner confirmation
   */
  resendPartnerConfirmation(
    params: {
      /** requestBody */
      body?: EmailAndAppUrl;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/resend-partner-confirmation';

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
   * Verifies token is valid
   */
  isUserConfirmationTokenValid(
    params: {
      /** requestBody */
      body?: ConfirmationRequest;
    } = {} as any,
    options: IRequestOptions = {},
  ): Promise<SuccessDTO> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/user/is-confirmation-token-valid';

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
  orderBy?: ListingOrderByKeys[];

  /**  */
  orderDir?: OrderByEnum[];

  /**  */
  search?: string;
}

export interface ListingFilterParams {
  /**  */
  $comparison: EnumListingFilterParamsComparison;

  /**  */
  name?: string;

  /**  */
  status?: ListingStatusEnum;

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

  /**  */
  ordinal?: number;
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
  untranslatedText?: string;

  /**  */
  ordinal: number;

  /**  */
  description?: string;

  /**  */
  links?: MultiselectLink[];

  /**  */
  collectAddress?: boolean;

  /**  */
  exclusive?: boolean;
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
  untranslatedText?: string;

  /**  */
  untranslatedOptOutText?: string;

  /**  */
  subText?: string;

  /**  */
  description?: string;

  /**  */
  links?: MultiselectLink[];

  /**  */
  jurisdictions: IdDTO[];

  /**  */
  options?: MultiselectOption[];

  /**  */
  optOutText?: string;

  /**  */
  hideFromListing?: boolean;

  /**  */
  applicationSection: MultiselectQuestionsApplicationSectionEnum;
}

export interface ListingMultiselectQuestion {
  /**  */
  multiselectQuestions: MultiselectQuestion;

  /**  */
  ordinal?: number;
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
  language: LanguagesEnum;

  /**  */
  assets: Asset;
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

  /**  */
  label?: string;

  /**  */
  externalReference?: string;

  /**  */
  acceptsPostmarkedApplications?: boolean;

  /**  */
  phoneNumber?: string;

  /**  */
  paperApplications?: PaperApplication[];
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

export interface ListingImage {
  /**  */
  assets: Asset;

  /**  */
  ordinal?: number;
}

export interface ListingFeatures {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  elevator?: boolean;

  /**  */
  wheelchairRamp?: boolean;

  /**  */
  serviceAnimalsAllowed?: boolean;

  /**  */
  accessibleParking?: boolean;

  /**  */
  parkingOnSite?: boolean;

  /**  */
  inUnitWasherDryer?: boolean;

  /**  */
  laundryInBuilding?: boolean;

  /**  */
  barrierFreeEntrance?: boolean;

  /**  */
  rollInShower?: boolean;

  /**  */
  grabBars?: boolean;

  /**  */
  heatingInUnit?: boolean;

  /**  */
  acInUnit?: boolean;

  /**  */
  hearing?: boolean;

  /**  */
  visual?: boolean;

  /**  */
  mobility?: boolean;
}

export interface ListingUtilities {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  water?: boolean;

  /**  */
  gas?: boolean;

  /**  */
  trash?: boolean;

  /**  */
  sewer?: boolean;

  /**  */
  electricity?: boolean;

  /**  */
  cable?: boolean;

  /**  */
  phone?: boolean;

  /**  */
  internet?: boolean;
}

export interface AmiChartItem {
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
  name: string;

  /**  */
  jurisdictions: IdDTO;
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

export interface UnitAmiChartOverride {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  items: AmiChartItem[];
}

export interface Unit {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  amiChart?: AmiChart;

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
  sqFeet?: string;

  /**  */
  monthlyRentAsPercentOfIncome?: string;

  /**  */
  bmrProgramChart?: boolean;

  /**  */
  unitTypes?: UnitType;

  /**  */
  unitRentTypes?: UnitRentType;

  /**  */
  unitAccessibilityPriorityTypes?: UnitAccessibilityPriorityType;

  /**  */
  unitAmiChartOverrides?: UnitAmiChartOverride;
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

export interface UnitsSummary {
  /**  */
  id: string;

  /**  */
  unitTypes: IdDTO;

  /**  */
  monthlyRentMin?: number;

  /**  */
  monthlyRentMax?: number;

  /**  */
  monthlyRentAsPercentOfIncome?: string;

  /**  */
  amiPercentage?: number;

  /**  */
  minimumIncomeMin?: string;

  /**  */
  minimumIncomeMax?: string;

  /**  */
  maxOccupancy?: number;

  /**  */
  minOccupancy?: number;

  /**  */
  floorMin?: number;

  /**  */
  floorMax?: number;

  /**  */
  sqFeetMin?: string;

  /**  */
  sqFeetMax?: string;

  /**  */
  unitAccessibilityPriorityTypes?: IdDTO;

  /**  */
  totalCount?: number;

  /**  */
  totalAvailable?: number;
}

export interface Listing {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  additionalApplicationSubmissionNotes?: string;

  /**  */
  digitalApplication?: boolean;

  /**  */
  commonDigitalApplication?: boolean;

  /**  */
  paperApplication?: boolean;

  /**  */
  referralOpportunity?: boolean;

  /**  */
  accessibility?: string;

  /**  */
  amenities?: string;

  /**  */
  buildingTotalUnits?: number;

  /**  */
  developer?: string;

  /**  */
  householdSizeMax?: number;

  /**  */
  householdSizeMin?: number;

  /**  */
  neighborhood?: string;

  /**  */
  petPolicy?: string;

  /**  */
  smokingPolicy?: string;

  /**  */
  unitsAvailable?: number;

  /**  */
  unitAmenities?: string;

  /**  */
  servicesOffered?: string;

  /**  */
  yearBuilt?: number;

  /**  */
  applicationDueDate?: Date;

  /**  */
  applicationOpenDate?: Date;

  /**  */
  applicationFee?: string;

  /**  */
  applicationOrganization?: string;

  /**  */
  applicationPickUpAddressOfficeHours?: string;

  /**  */
  applicationPickUpAddressType?: ApplicationAddressTypeEnum;

  /**  */
  applicationDropOffAddressOfficeHours?: string;

  /**  */
  applicationDropOffAddressType?: ApplicationAddressTypeEnum;

  /**  */
  applicationMailingAddressType?: ApplicationAddressTypeEnum;

  /**  */
  buildingSelectionCriteria?: string;

  /**  */
  costsNotIncluded?: string;

  /**  */
  creditHistory?: string;

  /**  */
  criminalBackground?: string;

  /**  */
  depositMin?: string;

  /**  */
  depositMax?: string;

  /**  */
  depositHelperText?: string;

  /**  */
  disableUnitsAccordion?: boolean;

  /**  */
  leasingAgentEmail?: string;

  /**  */
  leasingAgentName?: string;

  /**  */
  leasingAgentOfficeHours?: string;

  /**  */
  leasingAgentPhone?: string;

  /**  */
  leasingAgentTitle?: string;

  /**  */
  name: string;

  /**  */
  postmarkedApplicationsReceivedByDate?: Date;

  /**  */
  programRules?: string;

  /**  */
  rentalAssistance?: string;

  /**  */
  rentalHistory?: string;

  /**  */
  requiredDocuments?: string;

  /**  */
  specialNotes?: string;

  /**  */
  waitlistCurrentSize?: number;

  /**  */
  waitlistMaxSize?: number;

  /**  */
  whatToExpect?: string;

  /**  */
  status: ListingsStatusEnum;

  /**  */
  reviewOrderType?: ReviewOrderTypeEnum;

  /**  */
  applicationConfig?: object;

  /**  */
  displayWaitlistSize: boolean;

  /**  */
  showWaitlist?: boolean;

  /**  */
  reservedCommunityDescription?: string;

  /**  */
  reservedCommunityMinAge?: number;

  /**  */
  resultLink?: string;

  /**  */
  isWaitlistOpen?: boolean;

  /**  */
  waitlistOpenSpots?: number;

  /**  */
  customMapPin?: boolean;

  /**  */
  publishedAt?: Date;

  /**  */
  closedAt?: Date;

  /**  */
  afsLastRunAt?: Date;

  /**  */
  lastApplicationUpdateAt?: Date;

  /**  */
  listingMultiselectQuestions?: ListingMultiselectQuestion[];

  /**  */
  applicationMethods: ApplicationMethod[];

  /**  */
  referralApplication?: ApplicationMethod;

  /**  */
  assets: Asset[];

  /**  */
  listingEvents: Asset[];

  /**  */
  listingsBuildingAddress: Address;

  /**  */
  listingsApplicationPickUpAddress?: Address;

  /**  */
  listingsApplicationDropOffAddress?: Address;

  /**  */
  listingsApplicationMailingAddress?: Address;

  /**  */
  listingsLeasingAgentAddress?: Address;

  /**  */
  listingsBuildingSelectionCriteriaFile?: Asset;

  /**  */
  jurisdictions: IdDTO;

  /**  */
  listingsResult?: Asset;

  /**  */
  reservedCommunityTypes?: IdDTO;

  /**  */
  listingImages?: ListingImage[];

  /**  */
  listingFeatures?: ListingFeatures;

  /**  */
  listingUtilities?: ListingUtilities;

  /**  */
  units: Unit[];

  /**  */
  unitsSummarized?: UnitsSummarized;

  /**  */
  unitsSummary?: UnitsSummary[];

  /**  */
  urlSlug?: string;
}

export interface PaginatedListing {
  /**  */
  items: Listing[];
}

export interface UnitAmiChartOverrideCreate {
  /**  */
  items: AmiChartItem[];
}

export interface UnitCreate {
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
  sqFeet?: string;

  /**  */
  monthlyRentAsPercentOfIncome?: string;

  /**  */
  bmrProgramChart?: boolean;

  /**  */
  unitTypes?: IdDTO;

  /**  */
  amiChart?: IdDTO;

  /**  */
  unitAccessibilityPriorityTypes?: IdDTO;

  /**  */
  unitRentTypes?: IdDTO;

  /**  */
  unitAmiChartOverrides?: UnitAmiChartOverrideCreate;
}

export interface AssetCreate {
  /**  */
  fileId: string;

  /**  */
  label: string;
}

export interface PaperApplicationCreate {
  /**  */
  language: LanguagesEnum;

  /**  */
  assets?: AssetCreate;
}

export interface ApplicationMethodCreate {
  /**  */
  type: ApplicationMethodsTypeEnum;

  /**  */
  label?: string;

  /**  */
  externalReference?: string;

  /**  */
  acceptsPostmarkedApplications?: boolean;

  /**  */
  phoneNumber?: string;

  /**  */
  paperApplications?: PaperApplicationCreate[];
}

export interface UnitsSummaryCreate {
  /**  */
  unitTypes: IdDTO;

  /**  */
  monthlyRentMin?: number;

  /**  */
  monthlyRentMax?: number;

  /**  */
  monthlyRentAsPercentOfIncome?: string;

  /**  */
  amiPercentage?: number;

  /**  */
  minimumIncomeMin?: string;

  /**  */
  minimumIncomeMax?: string;

  /**  */
  maxOccupancy?: number;

  /**  */
  minOccupancy?: number;

  /**  */
  floorMin?: number;

  /**  */
  floorMax?: number;

  /**  */
  sqFeetMin?: string;

  /**  */
  sqFeetMax?: string;

  /**  */
  unitAccessibilityPriorityTypes?: IdDTO;

  /**  */
  totalCount?: number;

  /**  */
  totalAvailable?: number;
}

export interface ListingImageCreate {
  /**  */
  ordinal?: number;

  /**  */
  assets: AssetCreate;
}

export interface AddressCreate {
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

export interface ListingEventCreate {
  /**  */
  type: ListingEventsTypeEnum;

  /**  */
  startDate?: Date;

  /**  */
  startTime?: Date;

  /**  */
  endTime?: Date;

  /**  */
  url?: string;

  /**  */
  note?: string;

  /**  */
  label?: string;

  /**  */
  assets?: AssetCreate;
}

export interface ListingFeaturesCreate {
  /**  */
  elevator?: boolean;

  /**  */
  wheelchairRamp?: boolean;

  /**  */
  serviceAnimalsAllowed?: boolean;

  /**  */
  accessibleParking?: boolean;

  /**  */
  parkingOnSite?: boolean;

  /**  */
  inUnitWasherDryer?: boolean;

  /**  */
  laundryInBuilding?: boolean;

  /**  */
  barrierFreeEntrance?: boolean;

  /**  */
  rollInShower?: boolean;

  /**  */
  grabBars?: boolean;

  /**  */
  heatingInUnit?: boolean;

  /**  */
  acInUnit?: boolean;

  /**  */
  hearing?: boolean;

  /**  */
  visual?: boolean;

  /**  */
  mobility?: boolean;
}

export interface ListingUtilitiesCreate {
  /**  */
  water?: boolean;

  /**  */
  gas?: boolean;

  /**  */
  trash?: boolean;

  /**  */
  sewer?: boolean;

  /**  */
  electricity?: boolean;

  /**  */
  cable?: boolean;

  /**  */
  phone?: boolean;

  /**  */
  internet?: boolean;
}

export interface ListingCreate {
  /**  */
  additionalApplicationSubmissionNotes?: string;

  /**  */
  digitalApplication?: boolean;

  /**  */
  commonDigitalApplication?: boolean;

  /**  */
  paperApplication?: boolean;

  /**  */
  referralOpportunity?: boolean;

  /**  */
  accessibility?: string;

  /**  */
  amenities?: string;

  /**  */
  buildingTotalUnits?: number;

  /**  */
  developer?: string;

  /**  */
  householdSizeMax?: number;

  /**  */
  householdSizeMin?: number;

  /**  */
  neighborhood?: string;

  /**  */
  petPolicy?: string;

  /**  */
  smokingPolicy?: string;

  /**  */
  unitsAvailable?: number;

  /**  */
  unitAmenities?: string;

  /**  */
  servicesOffered?: string;

  /**  */
  yearBuilt?: number;

  /**  */
  applicationDueDate?: Date;

  /**  */
  applicationOpenDate?: Date;

  /**  */
  applicationFee?: string;

  /**  */
  applicationOrganization?: string;

  /**  */
  applicationPickUpAddressOfficeHours?: string;

  /**  */
  applicationPickUpAddressType?: ApplicationAddressTypeEnum;

  /**  */
  applicationDropOffAddressOfficeHours?: string;

  /**  */
  applicationDropOffAddressType?: ApplicationAddressTypeEnum;

  /**  */
  applicationMailingAddressType?: ApplicationAddressTypeEnum;

  /**  */
  buildingSelectionCriteria?: string;

  /**  */
  costsNotIncluded?: string;

  /**  */
  creditHistory?: string;

  /**  */
  criminalBackground?: string;

  /**  */
  depositMin?: string;

  /**  */
  depositMax?: string;

  /**  */
  depositHelperText?: string;

  /**  */
  disableUnitsAccordion?: boolean;

  /**  */
  leasingAgentEmail?: string;

  /**  */
  leasingAgentName?: string;

  /**  */
  leasingAgentOfficeHours?: string;

  /**  */
  leasingAgentPhone?: string;

  /**  */
  leasingAgentTitle?: string;

  /**  */
  name: string;

  /**  */
  postmarkedApplicationsReceivedByDate?: Date;

  /**  */
  programRules?: string;

  /**  */
  rentalAssistance?: string;

  /**  */
  rentalHistory?: string;

  /**  */
  requiredDocuments?: string;

  /**  */
  specialNotes?: string;

  /**  */
  waitlistCurrentSize?: number;

  /**  */
  waitlistMaxSize?: number;

  /**  */
  whatToExpect?: string;

  /**  */
  status: ListingsStatusEnum;

  /**  */
  reviewOrderType?: ReviewOrderTypeEnum;

  /**  */
  displayWaitlistSize: boolean;

  /**  */
  reservedCommunityDescription?: string;

  /**  */
  reservedCommunityMinAge?: number;

  /**  */
  resultLink?: string;

  /**  */
  isWaitlistOpen?: boolean;

  /**  */
  waitlistOpenSpots?: number;

  /**  */
  customMapPin?: boolean;

  /**  */
  lastApplicationUpdateAt?: Date;

  /**  */
  jurisdictions: IdDTO;

  /**  */
  reservedCommunityTypes?: IdDTO;

  /**  */
  listingMultiselectQuestions?: IdDTO[];

  /**  */
  units?: UnitCreate[];

  /**  */
  applicationMethods?: ApplicationMethodCreate[];

  /**  */
  assets: AssetCreate[];

  /**  */
  unitsSummary: UnitsSummaryCreate[];

  /**  */
  listingImages?: ListingImageCreate[];

  /**  */
  listingsApplicationPickUpAddress?: AddressCreate;

  /**  */
  listingsApplicationMailingAddress?: AddressCreate;

  /**  */
  listingsApplicationDropOffAddress?: AddressCreate;

  /**  */
  listingsLeasingAgentAddress?: AddressCreate;

  /**  */
  listingsBuildingAddress?: AddressCreate;

  /**  */
  listingsBuildingSelectionCriteriaFile?: AssetCreate;

  /**  */
  listingsResult?: AssetCreate;

  /**  */
  listingEvents: ListingEventCreate[];

  /**  */
  listingFeatures?: ListingFeaturesCreate;

  /**  */
  listingUtilities?: ListingUtilitiesCreate;
}

export interface ListingUpdate {
  /**  */
  id: string;

  /**  */
  additionalApplicationSubmissionNotes?: string;

  /**  */
  digitalApplication?: boolean;

  /**  */
  commonDigitalApplication?: boolean;

  /**  */
  paperApplication?: boolean;

  /**  */
  referralOpportunity?: boolean;

  /**  */
  accessibility?: string;

  /**  */
  amenities?: string;

  /**  */
  buildingTotalUnits?: number;

  /**  */
  developer?: string;

  /**  */
  householdSizeMax?: number;

  /**  */
  householdSizeMin?: number;

  /**  */
  neighborhood?: string;

  /**  */
  petPolicy?: string;

  /**  */
  smokingPolicy?: string;

  /**  */
  unitsAvailable?: number;

  /**  */
  unitAmenities?: string;

  /**  */
  servicesOffered?: string;

  /**  */
  yearBuilt?: number;

  /**  */
  applicationDueDate?: Date;

  /**  */
  applicationOpenDate?: Date;

  /**  */
  applicationFee?: string;

  /**  */
  applicationOrganization?: string;

  /**  */
  applicationPickUpAddressOfficeHours?: string;

  /**  */
  applicationPickUpAddressType?: ApplicationAddressTypeEnum;

  /**  */
  applicationDropOffAddressOfficeHours?: string;

  /**  */
  applicationDropOffAddressType?: ApplicationAddressTypeEnum;

  /**  */
  applicationMailingAddressType?: ApplicationAddressTypeEnum;

  /**  */
  buildingSelectionCriteria?: string;

  /**  */
  costsNotIncluded?: string;

  /**  */
  creditHistory?: string;

  /**  */
  criminalBackground?: string;

  /**  */
  depositMin?: string;

  /**  */
  depositMax?: string;

  /**  */
  depositHelperText?: string;

  /**  */
  disableUnitsAccordion?: boolean;

  /**  */
  leasingAgentEmail?: string;

  /**  */
  leasingAgentName?: string;

  /**  */
  leasingAgentOfficeHours?: string;

  /**  */
  leasingAgentPhone?: string;

  /**  */
  leasingAgentTitle?: string;

  /**  */
  name: string;

  /**  */
  postmarkedApplicationsReceivedByDate?: Date;

  /**  */
  programRules?: string;

  /**  */
  rentalAssistance?: string;

  /**  */
  rentalHistory?: string;

  /**  */
  requiredDocuments?: string;

  /**  */
  specialNotes?: string;

  /**  */
  waitlistCurrentSize?: number;

  /**  */
  waitlistMaxSize?: number;

  /**  */
  whatToExpect?: string;

  /**  */
  status: ListingsStatusEnum;

  /**  */
  reviewOrderType?: ReviewOrderTypeEnum;

  /**  */
  displayWaitlistSize: boolean;

  /**  */
  reservedCommunityDescription?: string;

  /**  */
  reservedCommunityMinAge?: number;

  /**  */
  resultLink?: string;

  /**  */
  isWaitlistOpen?: boolean;

  /**  */
  waitlistOpenSpots?: number;

  /**  */
  customMapPin?: boolean;

  /**  */
  lastApplicationUpdateAt?: Date;

  /**  */
  jurisdictions: IdDTO;

  /**  */
  reservedCommunityTypes?: IdDTO;

  /**  */
  listingMultiselectQuestions?: IdDTO[];

  /**  */
  units?: UnitCreate[];

  /**  */
  applicationMethods?: ApplicationMethodCreate[];

  /**  */
  assets: AssetCreate[];

  /**  */
  unitsSummary: UnitsSummaryCreate[];

  /**  */
  listingImages?: ListingImageCreate[];

  /**  */
  listingsApplicationPickUpAddress?: AddressCreate;

  /**  */
  listingsApplicationMailingAddress?: AddressCreate;

  /**  */
  listingsApplicationDropOffAddress?: AddressCreate;

  /**  */
  listingsLeasingAgentAddress?: AddressCreate;

  /**  */
  listingsBuildingAddress?: AddressCreate;

  /**  */
  listingsBuildingSelectionCriteriaFile?: AssetCreate;

  /**  */
  listingsResult?: AssetCreate;

  /**  */
  listingEvents: ListingEventCreate[];

  /**  */
  listingFeatures?: ListingFeaturesCreate;

  /**  */
  listingUtilities?: ListingUtilitiesCreate;
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

export interface ReservedCommunityTypeCreate {
  /**  */
  name: string;

  /**  */
  description?: string;

  /**  */
  jurisdictions: IdDTO;
}

export interface ReservedCommunityTypeUpdate {
  /**  */
  id: string;

  /**  */
  name: string;

  /**  */
  description?: string;
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
  description?: string;

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

export interface JurisdictionCreate {
  /**  */
  name: string;

  /**  */
  notificationsSignUpUrl?: string;

  /**  */
  languages: LanguagesEnum[];

  /**  */
  partnerTerms?: string;

  /**  */
  publicUrl: string;

  /**  */
  emailFromAddress: string;

  /**  */
  rentalAssistanceDefault: string;

  /**  */
  enablePartnerSettings?: boolean;

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
  notificationsSignUpUrl?: string;

  /**  */
  languages: LanguagesEnum[];

  /**  */
  partnerTerms?: string;

  /**  */
  publicUrl: string;

  /**  */
  emailFromAddress: string;

  /**  */
  rentalAssistanceDefault: string;

  /**  */
  enablePartnerSettings?: boolean;

  /**  */
  enableAccessibilityFeatures: boolean;

  /**  */
  enableUtilitiesIncluded: boolean;
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
  notificationsSignUpUrl?: string;

  /**  */
  languages: LanguagesEnum[];

  /**  */
  multiselectQuestions: IdDTO[];

  /**  */
  partnerTerms?: string;

  /**  */
  publicUrl: string;

  /**  */
  emailFromAddress: string;

  /**  */
  rentalAssistanceDefault: string;

  /**  */
  enablePartnerSettings?: boolean;

  /**  */
  enableAccessibilityFeatures: boolean;

  /**  */
  enableUtilitiesIncluded: boolean;
}

export interface MultiselectQuestionCreate {
  /**  */
  text: string;

  /**  */
  untranslatedOptOutText?: string;

  /**  */
  subText?: string;

  /**  */
  description?: string;

  /**  */
  links?: MultiselectLink[];

  /**  */
  jurisdictions: IdDTO[];

  /**  */
  options?: MultiselectOption[];

  /**  */
  optOutText?: string;

  /**  */
  hideFromListing?: boolean;

  /**  */
  applicationSection: MultiselectQuestionsApplicationSectionEnum;
}

export interface MultiselectQuestionUpdate {
  /**  */
  id: string;

  /**  */
  text: string;

  /**  */
  untranslatedOptOutText?: string;

  /**  */
  subText?: string;

  /**  */
  description?: string;

  /**  */
  links?: MultiselectLink[];

  /**  */
  jurisdictions: IdDTO[];

  /**  */
  options?: MultiselectOption[];

  /**  */
  optOutText?: string;

  /**  */
  hideFromListing?: boolean;

  /**  */
  applicationSection: MultiselectQuestionsApplicationSectionEnum;
}

export interface MultiselectQuestionFilterParams {
  /**  */
  $comparison: EnumMultiselectQuestionFilterParamsComparison;

  /**  */
  jurisdiction?: string;

  /**  */
  applicationSection?: MultiselectQuestionsApplicationSectionEnum;
}

export interface MultiselectQuestionQueryParams {
  /**  */
  filter?: MultiselectQuestionFilterParams[];
}

export interface AddressInput {
  /**  */
  type: InputType;

  /**  */
  key: string;

  /**  */
  value: Address;
}

export interface BooleanInput {
  /**  */
  type: InputType;

  /**  */
  key: string;

  /**  */
  value: boolean;
}

export interface TextInput {
  /**  */
  type: InputType;

  /**  */
  key: string;

  /**  */
  value: string;
}

export interface Accessibility {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  mobility?: boolean;

  /**  */
  vision?: boolean;

  /**  */
  hearing?: boolean;
}

export interface Demographic {
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
  workInRegion?: YesNoEnum;

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
  address: Address;
}

export interface HouseholdMember {
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
  sameAddress?: YesNoEnum;

  /**  */
  relationship?: string;

  /**  */
  workInRegion?: YesNoEnum;

  /**  */
  householdMemberWorkAddress?: Address;

  /**  */
  householdMemberAddress: Address;
}

export interface ApplicationMultiselectQuestionOption {
  /**  */
  key: string;

  /**  */
  checked: boolean;

  /**  */
  extraData?: AllExtraDataTypes[];
}

export interface ApplicationMultiselectQuestion {
  /**  */
  key: string;

  /**  */
  claimed: boolean;

  /**  */
  options: ApplicationMultiselectQuestionOption[];
}

export interface Application {
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
  householdSize: number;

  /**  */
  housingStatus?: string;

  /**  */
  sendMailToMailingAddress?: boolean;

  /**  */
  householdExpectingChanges?: boolean;

  /**  */
  householdStudent?: boolean;

  /**  */
  incomeVouchers?: boolean;

  /**  */
  income?: string;

  /**  */
  incomePeriod?: IncomePeriodEnum;

  /**  */
  status: ApplicationStatusEnum;

  /**  */
  language?: LanguagesEnum;

  /**  */
  acceptedTerms?: boolean;

  /**  */
  submissionType: ApplicationSubmissionTypeEnum;

  /**  */
  submissionDate?: Date;

  /**  */
  markedAsDuplicate: boolean;

  /**  */
  flagged?: boolean;

  /**  */
  confirmationCode: string;

  /**  */
  reviewStatus?: ApplicationReviewStatusEnum;

  /**  */
  applicationsMailingAddress: Address;

  /**  */
  applicationsAlternateAddress: Address;

  /**  */
  accessibility: Accessibility;

  /**  */
  demographics: Demographic;

  /**  */
  preferredUnitTypes: IdDTO[];

  /**  */
  applicant: Applicant;

  /**  */
  alternateContact: AlternateContact;

  /**  */
  householdMember: HouseholdMember[];

  /**  */
  preferences?: ApplicationMultiselectQuestion[];

  /**  */
  programs?: ApplicationMultiselectQuestion[];

  /**  */
  listings: IdDTO;
}

export interface PaginatedApplication {
  /**  */
  items: Application[];
}

export interface ApplicantUpdate {
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
  workInRegion?: YesNoEnum;

  /**  */
  applicantAddress: AddressCreate;

  /**  */
  applicantWorkAddress: AddressCreate;
}

export interface AlternateContactUpdate {
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
  address: AddressCreate;
}

export interface AccessibilityUpdate {
  /**  */
  mobility?: boolean;

  /**  */
  vision?: boolean;

  /**  */
  hearing?: boolean;
}

export interface DemographicUpdate {
  /**  */
  ethnicity?: string;

  /**  */
  gender?: string;

  /**  */
  sexualOrientation?: string;

  /**  */
  howDidYouHear: string[];

  /**  */
  race: string[];
}

export interface HouseholdMemberUpdate {
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
  sameAddress?: YesNoEnum;

  /**  */
  relationship?: string;

  /**  */
  workInRegion?: YesNoEnum;

  /**  */
  householdMemberAddress: AddressCreate;

  /**  */
  householdMemberWorkAddress: AddressCreate;
}

export interface ApplicationCreate {
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
  householdSize: number;

  /**  */
  housingStatus?: string;

  /**  */
  sendMailToMailingAddress?: boolean;

  /**  */
  householdExpectingChanges?: boolean;

  /**  */
  householdStudent?: boolean;

  /**  */
  incomeVouchers?: boolean;

  /**  */
  income?: string;

  /**  */
  incomePeriod?: IncomePeriodEnum;

  /**  */
  status: ApplicationStatusEnum;

  /**  */
  language?: LanguagesEnum;

  /**  */
  acceptedTerms?: boolean;

  /**  */
  submissionType: ApplicationSubmissionTypeEnum;

  /**  */
  submissionDate?: Date;

  /**  */
  reviewStatus?: ApplicationReviewStatusEnum;

  /**  */
  preferredUnitTypes: IdDTO[];

  /**  */
  preferences?: ApplicationMultiselectQuestion[];

  /**  */
  programs?: ApplicationMultiselectQuestion[];

  /**  */
  listings: IdDTO;

  /**  */
  applicant: ApplicantUpdate;

  /**  */
  applicationsMailingAddress: AddressCreate;

  /**  */
  applicationsAlternateAddress: AddressCreate;

  /**  */
  alternateContact: AlternateContactUpdate;

  /**  */
  accessibility: AccessibilityUpdate;

  /**  */
  demographics: DemographicUpdate;

  /**  */
  householdMember: HouseholdMemberUpdate[];
}

export interface ApplicationUpdate {
  /**  */
  id: string;

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
  householdSize: number;

  /**  */
  housingStatus?: string;

  /**  */
  sendMailToMailingAddress?: boolean;

  /**  */
  householdExpectingChanges?: boolean;

  /**  */
  householdStudent?: boolean;

  /**  */
  incomeVouchers?: boolean;

  /**  */
  income?: string;

  /**  */
  incomePeriod?: IncomePeriodEnum;

  /**  */
  status: ApplicationStatusEnum;

  /**  */
  language?: LanguagesEnum;

  /**  */
  acceptedTerms?: boolean;

  /**  */
  submissionType: ApplicationSubmissionTypeEnum;

  /**  */
  submissionDate?: Date;

  /**  */
  reviewStatus?: ApplicationReviewStatusEnum;

  /**  */
  preferredUnitTypes: IdDTO[];

  /**  */
  preferences?: ApplicationMultiselectQuestion[];

  /**  */
  programs?: ApplicationMultiselectQuestion[];

  /**  */
  listings: IdDTO;

  /**  */
  applicant: ApplicantUpdate;

  /**  */
  applicationsMailingAddress: AddressCreate;

  /**  */
  applicationsAlternateAddress: AddressCreate;

  /**  */
  alternateContact: AlternateContactUpdate;

  /**  */
  accessibility: AccessibilityUpdate;

  /**  */
  demographics: DemographicUpdate;

  /**  */
  householdMember: HouseholdMemberUpdate[];
}

export interface CreatePresignedUploadMetadata {
  /**  */
  parametersToSign: object;
}

export interface CreatePresignedUploadMetadataResponse {
  /**  */
  signature: string;
}

export interface EmailAndAppUrl {
  /**  */
  email: string;

  /**  */
  appUrl?: string;
}

export interface UserRole {
  /**  */
  isAdmin?: boolean;

  /**  */
  isJurisdictionalAdmin?: boolean;

  /**  */
  isPartner?: boolean;
}

export interface User {
  /**  */
  id: string;

  /**  */
  createdAt: Date;

  /**  */
  updatedAt: Date;

  /**  */
  passwordUpdatedAt: Date;

  /**  */
  passwordValidForDays: number;

  /**  */
  confirmedAt?: Date;

  /**  */
  email: string;

  /**  */
  middleName?: string;

  /**  */
  lastName: string;

  /**  */
  dob?: Date;

  /**  */
  phoneNumber?: string;

  /**  */
  listings: IdDTO[];

  /**  */
  userRoles?: UserRole;

  /**  */
  language?: LanguagesEnum;

  /**  */
  jurisdictions: IdDTO[];

  /**  */
  mfaEnabled?: boolean;

  /**  */
  lastLoginAt?: Date;

  /**  */
  failedLoginAttemptsCount?: number;

  /**  */
  phoneNumberVerified?: boolean;

  /**  */
  agreedToTermsOfService: boolean;

  /**  */
  hitConfirmationURL?: Date;

  /**  */
  activeAccessToken?: string;

  /**  */
  activeRefreshToken?: string;
}

export interface PaginatedUser {
  /**  */
  items: User[];
}

export interface UserUpdate {
  /**  */
  id: string;

  /**  */
  middleName?: string;

  /**  */
  lastName: string;

  /**  */
  dob?: Date;

  /**  */
  phoneNumber?: string;

  /**  */
  listings: IdDTO[];

  /**  */
  userRoles?: UserRole;

  /**  */
  language?: LanguagesEnum;

  /**  */
  jurisdictions: IdDTO[];

  /**  */
  email?: string;

  /**  */
  newEmail?: string;

  /**  */
  password?: string;

  /**  */
  currentPassword?: string;

  /**  */
  appUrl?: string;
}

export interface UserCreate {
  /**  */
  middleName?: string;

  /**  */
  lastName: string;

  /**  */
  dob?: Date;

  /**  */
  phoneNumber?: string;

  /**  */
  listings: IdDTO[];

  /**  */
  language?: LanguagesEnum;

  /**  */
  newEmail?: string;

  /**  */
  appUrl?: string;

  /**  */
  password: string;

  /**  */
  passwordConfirmation: string;

  /**  */
  email: string;

  /**  */
  emailConfirmation: string;

  /**  */
  jurisdictions?: IdDTO[];
}

export interface UserInvite {
  /**  */
  middleName?: string;

  /**  */
  lastName: string;

  /**  */
  dob?: Date;

  /**  */
  phoneNumber?: string;

  /**  */
  listings: IdDTO[];

  /**  */
  userRoles?: UserRole;

  /**  */
  language?: LanguagesEnum;

  /**  */
  jurisdictions: IdDTO[];

  /**  */
  newEmail?: string;

  /**  */
  appUrl?: string;

  /**  */
  email: string;
}

export interface ConfirmationRequest {
  /**  */
  token: string;
}

export enum ListingViews {
  'fundamentals' = 'fundamentals',
  'base' = 'base',
  'full' = 'full',
  'details' = 'details',
}

export enum ListingOrderByKeys {
  'mostRecentlyUpdated' = 'mostRecentlyUpdated',
  'applicationDates' = 'applicationDates',
  'mostRecentlyClosed' = 'mostRecentlyClosed',
  'mostRecentlyPublished' = 'mostRecentlyPublished',
  'name' = 'name',
  'waitlistOpen' = 'waitlistOpen',
  'status' = 'status',
  'unitsAvailable' = 'unitsAvailable',
  'marketingType' = 'marketingType',
}

export enum OrderByEnum {
  'asc' = 'asc',
  'desc' = 'desc',
}

export enum ListingStatusEnum {
  'active' = 'active',
  'pending' = 'pending',
  'closed' = 'closed',
}
export enum EnumListingFilterParamsComparison {
  '=' = '=',
  '<>' = '<>',
  'IN' = 'IN',
  '>=' = '>=',
  '<=' = '<=',
  'NA' = 'NA',
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

export enum LanguagesEnum {
  'en' = 'en',
  'es' = 'es',
  'vi' = 'vi',
  'zh' = 'zh',
  'tl' = 'tl',
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

export enum UnitRentTypeEnum {
  'fixed' = 'fixed',
  'percentageOfIncome' = 'percentageOfIncome',
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

export enum ListingEventsTypeEnum {
  'openHouse' = 'openHouse',
  'publicLottery' = 'publicLottery',
  'lotteryResults' = 'lotteryResults',
}
export enum EnumMultiselectQuestionFilterParamsComparison {
  '=' = '=',
  '<>' = '<>',
  'IN' = 'IN',
  '>=' = '>=',
  '<=' = '<=',
  'NA' = 'NA',
}
export enum InputType {
  'boolean' = 'boolean',
  'text' = 'text',
  'address' = 'address',
  'hhMemberSelect' = 'hhMemberSelect',
}

export enum ApplicationOrderByKeys {
  'firstName' = 'firstName',
  'lastName' = 'lastName',
  'submissionDate' = 'submissionDate',
  'createdAt' = 'createdAt',
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
export type AllExtraDataTypes = BooleanInput | TextInput | AddressInput;
