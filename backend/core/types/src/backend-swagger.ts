/** Generate by swagger-axios-codegen */
// tslint:disable
/* eslint-disable */
import axiosStatic, { AxiosInstance } from "axios"

export interface IRequestOptions {
  headers?: any
  baseURL?: string
  responseType?: string
}

export interface IRequestConfig {
  method?: any
  headers?: any
  url?: any
  data?: any
  params?: any
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance
}

// Add default options
export const serviceOptions: ServiceOptions = {}

// Instance selector
export function axios(
  configs: IRequestConfig,
  resolve: (p: any) => void,
  reject: (p: any) => void
): Promise<any> {
  if (serviceOptions.axios) {
    return serviceOptions.axios
      .request(configs)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  } else {
    throw new Error("please inject yourself instance like axios  ")
  }
}

export function getConfigs(
  method: string,
  contentType: string,
  url: string,
  options: any
): IRequestConfig {
  const configs: IRequestConfig = { ...options, method, url }
  configs.headers = {
    ...options.headers,
    "Content-Type": contentType,
  }
  return configs
}

const basePath = ""

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[]
}

export class ListResult<T> implements IListResult<T> {
  items?: T[]
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount?: number
  items?: T[]
}

export class PagedResult<T> implements IPagedResult<T> {
  totalCount?: number
  items?: T[]
}

// customer definition
// empty

export class AmiChartsService {
  /**
   * List amiCharts
   */
  list(
    params: {
      /**  */
      jurisdictionName?: string
      /**  */
      jurisdictionId?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AmiChart[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/amiCharts"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        jurisdictionName: params["jurisdictionName"],
        jurisdictionId: params["jurisdictionId"],
      }
      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create amiChart
   */
  create(
    params: {
      /** requestBody */
      body?: AmiChartCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AmiChart> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/amiCharts"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete amiChart by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/amiCharts"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update amiChart
   */
  update(
    params: {
      /** requestBody */
      body?: AmiChartUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AmiChart> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/amiCharts/{amiChartId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get amiChart by id
   */
  retrieve(
    params: {
      /**  */
      amiChartId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AmiChart> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/amiCharts/{amiChartId}"
      url = url.replace("{amiChartId}", params["amiChartId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class ApplicationFlaggedSetsService {
  /**
   * Meta information for application flagged sets
   */
  meta(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number
      /**  */
      listingId: string
      /**  */
      view?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationFlaggedSetMeta> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationFlaggedSets/meta"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        listingId: params["listingId"],
        view: params["view"],
      }
      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * List application flagged sets
   */
  list(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number
      /**  */
      listingId: string
      /**  */
      view?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedApplicationFlaggedSet> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationFlaggedSets"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        listingId: params["listingId"],
        view: params["view"],
      }
      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Retrieve application flagged set by id
   */
  retrieve(
    params: {
      /**  */
      afsId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationFlaggedSet> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationFlaggedSets/{afsId}"
      url = url.replace("{afsId}", params["afsId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Resolve application flagged set
   */
  resolve(
    params: {
      /** requestBody */
      body?: ApplicationFlaggedSetResolve
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationFlaggedSet> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationFlaggedSets/resolve"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Reset flagged set confirmation alert
   */
  resetConfirmationAlert(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Status> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationFlaggedSets/{id}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Trigger the duplicate check process
   */
  process(options: IRequestOptions = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationFlaggedSets/process"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class ApplicationMethodsService {
  /**
   * List applicationMethods
   */
  list(options: IRequestOptions = {}): Promise<ApplicationMethod[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationMethods"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create applicationMethod
   */
  create(
    params: {
      /** requestBody */
      body?: ApplicationMethodCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationMethod> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationMethods"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete applicationMethod by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationMethods"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update applicationMethod
   */
  update(
    params: {
      /** requestBody */
      body?: ApplicationMethodUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationMethod> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationMethods/{applicationMethodId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get applicationMethod by id
   */
  retrieve(
    params: {
      /**  */
      applicationMethodId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ApplicationMethod> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applicationMethods/{applicationMethodId}"
      url = url.replace("{applicationMethodId}", params["applicationMethodId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class ApplicationsService {
  /**
   * List applications
   */
  list(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number
      /**  */
      listingId?: string
      /**  */
      search?: string
      /**  */
      userId?: string
      /**  */
      orderBy?: string
      /**  */
      order?: string
      /**  */
      markedAsDuplicate?: boolean
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedApplication> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        listingId: params["listingId"],
        search: params["search"],
        userId: params["userId"],
        orderBy: params["orderBy"],
        order: params["order"],
        markedAsDuplicate: params["markedAsDuplicate"],
      }
      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create application
   */
  create(
    params: {
      /** requestBody */
      body?: ApplicationCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete application by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * List applications as csv
   */
  listAsCsv(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number
      /**  */
      search?: string
      /**  */
      userId?: string
      /**  */
      orderBy?: string
      /**  */
      order?: string
      /**  */
      markedAsDuplicate?: boolean
      /**  */
      listingId: string
      /**  */
      includeDemographics?: boolean
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/csv"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        search: params["search"],
        userId: params["userId"],
        orderBy: params["orderBy"],
        order: params["order"],
        markedAsDuplicate: params["markedAsDuplicate"],
        listingId: params["listingId"],
        includeDemographics: params["includeDemographics"],
      }
      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get application by id
   */
  retrieve(
    params: {
      /**  */
      id: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update application by id
   */
  update(
    params: {
      /**  */
      id: string
      /** requestBody */
      body?: ApplicationUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Submit application
   */
  submit(
    params: {
      /** requestBody */
      body?: ApplicationCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/applications/submit"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class AssetsService {
  /**
   * Create asset
   */
  create(
    params: {
      /** requestBody */
      body?: AssetCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Asset> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/assets"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * List assets
   */
  list(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedAssets> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/assets"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = { page: params["page"], limit: params["limit"] }
      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create presigned upload metadata
   */
  createPresignedUploadMetadata(
    params: {
      /** requestBody */
      body?: CreatePresignedUploadMetadata
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CreatePresignedUploadMetadataResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/assets/presigned-upload-metadata"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get asset by id
   */
  retrieve(
    params: {
      /**  */
      assetId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Asset> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/assets/{assetId}"
      url = url.replace("{assetId}", params["assetId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class AuthService {
  /**
   * Login
   */
  login(
    params: {
      /** requestBody */
      body?: Login
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/auth/login"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Token
   */
  token(
    params: {
      /** requestBody */
      body?: Token
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/auth/token"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Request mfa code
   */
  requestMfaCode(
    params: {
      /** requestBody */
      body?: RequestMfaCode
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<RequestMfaCodeResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/auth/request-mfa-code"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get mfa info
   */
  getMfaInfo(
    params: {
      /** requestBody */
      body?: GetMfaInfo
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<GetMfaInfoResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/auth/mfa-info"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class UserService {
  /**
   *
   */
  userControllerProfile(options: IRequestOptions = {}): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create user
   */
  create(
    params: {
      /**  */
      noWelcomeEmail?: boolean
      /** requestBody */
      body?: UserCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UserBasic> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)
      configs.params = { noWelcomeEmail: params["noWelcomeEmail"] }
      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete user by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Resend confirmation
   */
  resendPartnerConfirmation(
    params: {
      /** requestBody */
      body?: Email
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Status> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/resend-partner-confirmation"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Verifies token is valid
   */
  isUserConfirmationTokenValid(
    params: {
      /** requestBody */
      body?: Confirm
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/is-confirmation-token-valid"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Resend confirmation
   */
  resendConfirmation(
    params: {
      /** requestBody */
      body?: Email
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Status> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/resend-confirmation"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Confirm email
   */
  confirm(
    params: {
      /** requestBody */
      body?: Confirm
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/confirm"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Forgot Password
   */
  forgotPassword(
    params: {
      /** requestBody */
      body?: ForgotPassword
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ForgotPasswordResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/forgot-password"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update Password
   */
  updatePassword(
    params: {
      /** requestBody */
      body?: UpdatePassword
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/update-password"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update user
   */
  update(
    params: {
      /** requestBody */
      body?: UserUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/{id}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get user by id
   */
  retrieve(
    params: {
      /**  */
      id: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * List users
   */
  list(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number | "all"
      /**  */
      filter?: UserFilterParams[]
      /**  */
      search?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedUserList> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/list"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        filter: params["filter"],
        search: params["search"],
      }
      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Invite user
   */
  invite(
    params: {
      /** requestBody */
      body?: UserInvite
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UserBasic> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/user/invite"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class UserProfileService {
  /**
   * Update profile user
   */
  update(
    params: {
      /** requestBody */
      body?: UserProfileUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/userProfile/{id}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class JurisdictionsService {
  /**
   * List jurisdictions
   */
  list(options: IRequestOptions = {}): Promise<Jurisdiction[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/jurisdictions"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create jurisdiction
   */
  create(
    params: {
      /** requestBody */
      body?: JurisdictionCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Jurisdiction> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/jurisdictions"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete jurisdiction by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/jurisdictions"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update jurisdiction
   */
  update(
    params: {
      /** requestBody */
      body?: JurisdictionUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Jurisdiction> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/jurisdictions/{jurisdictionId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get jurisdiction by id
   */
  retrieve(
    params: {
      /**  */
      jurisdictionId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Jurisdiction> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/jurisdictions/{jurisdictionId}"
      url = url.replace("{jurisdictionId}", params["jurisdictionId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get jurisdiction by name
   */
  retrieveByName(
    params: {
      /**  */
      jurisdictionName: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Jurisdiction> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/jurisdictions/byName/{jurisdictionName}"
      url = url.replace("{jurisdictionName}", params["jurisdictionName"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class ListingsService {
  /**
   * List listings
   */
  list(
    params: {
      /**  */
      page?: number
      /**  */
      limit?: number | "all"
      /**  */
      filter?: ListingFilterParams[]
      /**  */
      view?: string
      /**  */
      orderBy?: any | null[]
      /**  */
      orderDir?: any | null[]
      /**  */
      search?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaginatedListing> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = {
        page: params["page"],
        limit: params["limit"],
        filter: params["filter"],
        view: params["view"],
        orderBy: params["orderBy"],
        orderDir: params["orderDir"],
        search: params["search"],
      }
      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create listing
   */
  create(
    params: {
      /** requestBody */
      body?: ListingCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Listing> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete listing by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get listing by id
   */
  retrieve(
    params: {
      /**  */
      id: string
      /**  */
      view?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Listing> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = { view: params["view"] }
      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update listing by id
   */
  update(
    params: {
      /**  */
      id: string
      /** requestBody */
      body?: ListingUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Listing> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/listings/{id}"
      url = url.replace("{id}", params["id"] + "")

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class PaperApplicationsService {
  /**
   * List paperApplications
   */
  list(options: IRequestOptions = {}): Promise<PaperApplication[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/paperApplications"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create paperApplication
   */
  create(
    params: {
      /** requestBody */
      body?: PaperApplicationCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaperApplication> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/paperApplications"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete paperApplication by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/paperApplications"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update paperApplication
   */
  update(
    params: {
      /** requestBody */
      body?: PaperApplicationUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaperApplication> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/paperApplications/{paperApplicationId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get paperApplication by id
   */
  retrieve(
    params: {
      /**  */
      paperApplicationId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PaperApplication> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/paperApplications/{paperApplicationId}"
      url = url.replace("{paperApplicationId}", params["paperApplicationId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class MultiselectQuestionsService {
  /**
   * List multiselect questions
   */
  list(
    params: {
      /**  */
      filter?: MultiselectQuestionsFilterParams[]
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<MultiselectQuestion[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/multiselectQuestions"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = { filter: params["filter"] }
      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create multiselect question
   */
  create(
    params: {
      /** requestBody */
      body?: MultiselectQuestionCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<MultiselectQuestion> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/multiselectQuestions"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete multiselect question by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/multiselectQuestions"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update multiselect question
   */
  update(
    params: {
      /** requestBody */
      body?: MultiselectQuestionUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<MultiselectQuestion> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/multiselectQuestions/{multiselectQuestionId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get multiselect question by id
   */
  retrieve(
    params: {
      /**  */
      multiselectQuestionId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<MultiselectQuestion> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/multiselectQuestions/{multiselectQuestionId}"
      url = url.replace("{multiselectQuestionId}", params["multiselectQuestionId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class ReservedCommunityTypesService {
  /**
   * List reservedCommunityTypes
   */
  list(
    params: {
      /**  */
      jurisdictionName?: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ReservedCommunityType[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/reservedCommunityTypes"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)
      configs.params = { jurisdictionName: params["jurisdictionName"] }
      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create reservedCommunityType
   */
  create(
    params: {
      /** requestBody */
      body?: ReservedCommunityTypeCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ReservedCommunityType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/reservedCommunityTypes"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete reservedCommunityType by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/reservedCommunityTypes"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update reservedCommunityType
   */
  update(
    params: {
      /** requestBody */
      body?: ReservedCommunityTypeUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ReservedCommunityType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/reservedCommunityTypes/{reservedCommunityTypeId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get reservedCommunityType by id
   */
  retrieve(
    params: {
      /**  */
      reservedCommunityTypeId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ReservedCommunityType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/reservedCommunityTypes/{reservedCommunityTypeId}"
      url = url.replace("{reservedCommunityTypeId}", params["reservedCommunityTypeId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class TranslationsService {
  /**
   * List translations
   */
  list(options: IRequestOptions = {}): Promise<Translation[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/translations"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create translation
   */
  create(
    params: {
      /** requestBody */
      body?: TranslationCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Translation> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/translations"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete translation by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/translations"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update translation
   */
  update(
    params: {
      /** requestBody */
      body?: TranslationUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Translation> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/translations/{translationId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get translation by id
   */
  retrieve(
    params: {
      /**  */
      translationId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Translation> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/translations/{translationId}"
      url = url.replace("{translationId}", params["translationId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class UnitsService {
  /**
   * List units
   */
  list(options: IRequestOptions = {}): Promise<Unit[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/units"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create unit
   */
  create(
    params: {
      /** requestBody */
      body?: UnitCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Unit> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/units"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete unit by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/units"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update unit
   */
  update(
    params: {
      /** requestBody */
      body?: UnitUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Unit> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/units/{unitId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get unit by id
   */
  retrieve(
    params: {
      /**  */
      unitId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<Unit> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/units/{unitId}"
      url = url.replace("{unitId}", params["unitId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class UnitTypesService {
  /**
   * List unitTypes
   */
  list(options: IRequestOptions = {}): Promise<UnitType[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitTypes"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create unitType
   */
  create(
    params: {
      /** requestBody */
      body?: UnitTypeCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitTypes"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete unitType by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitTypes"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update unitType
   */
  update(
    params: {
      /** requestBody */
      body?: UnitTypeUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitTypes/{unitTypeId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get unitType by id
   */
  retrieve(
    params: {
      /**  */
      unitTypeId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitTypes/{unitTypeId}"
      url = url.replace("{unitTypeId}", params["unitTypeId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class UnitRentTypesService {
  /**
   * List unitRentTypes
   */
  list(options: IRequestOptions = {}): Promise<UnitRentType[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitRentTypes"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create unitRentType
   */
  create(
    params: {
      /** requestBody */
      body?: UnitRentTypeCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitRentType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitRentTypes"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete unitRentType by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitRentTypes"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update unitRentType
   */
  update(
    params: {
      /** requestBody */
      body?: UnitRentTypeUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitRentType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitRentTypes/{unitRentTypeId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get unitRentType by id
   */
  retrieve(
    params: {
      /**  */
      unitRentTypeId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitRentType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitRentTypes/{unitRentTypeId}"
      url = url.replace("{unitRentTypeId}", params["unitRentTypeId"] + "")

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export class UnitAccessibilityPriorityTypesService {
  /**
   * List unitAccessibilityPriorityTypes
   */
  list(options: IRequestOptions = {}): Promise<UnitAccessibilityPriorityType[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitAccessibilityPriorityTypes"

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Create unitAccessibilityPriorityType
   */
  create(
    params: {
      /** requestBody */
      body?: UnitAccessibilityPriorityTypeCreate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitAccessibilityPriorityType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitAccessibilityPriorityTypes"

      const configs: IRequestConfig = getConfigs("post", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Delete unitAccessibilityPriorityType by id
   */
  delete(
    params: {
      /** requestBody */
      body?: Id
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitAccessibilityPriorityTypes"

      const configs: IRequestConfig = getConfigs("delete", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Update unitAccessibilityPriorityType
   */
  update(
    params: {
      /** requestBody */
      body?: UnitAccessibilityPriorityTypeUpdate
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitAccessibilityPriorityType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitAccessibilityPriorityTypes/{unitAccessibilityPriorityTypeId}"

      const configs: IRequestConfig = getConfigs("put", "application/json", url, options)

      let data = params.body

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
  /**
   * Get unitAccessibilityPriorityType by id
   */
  retrieve(
    params: {
      /**  */
      unitAccessibilityPriorityTypeId: string
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UnitAccessibilityPriorityType> {
    return new Promise((resolve, reject) => {
      let url = basePath + "/unitAccessibilityPriorityTypes/{unitAccessibilityPriorityTypeId}"
      url = url.replace(
        "{unitAccessibilityPriorityTypeId}",
        params["unitAccessibilityPriorityTypeId"] + ""
      )

      const configs: IRequestConfig = getConfigs("get", "application/json", url, options)

      let data = null

      configs.data = data
      axios(configs, resolve, reject)
    })
  }
}

export interface AmiChartItem {
  /**  */
  percentOfAmi: number

  /**  */
  householdSize: number

  /**  */
  income: number
}

export interface Id {
  /**  */
  id: string
}

export interface AmiChart {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  items: AmiChartItem[]

  /**  */
  name: string

  /**  */
  jurisdiction: Id
}

export interface AmiChartCreate {
  /**  */
  items: AmiChartItem[]

  /**  */
  name: string

  /**  */
  jurisdiction: Id
}

export interface AmiChartUpdate {
  /**  */
  items: AmiChartItem[]

  /**  */
  name: string

  /**  */
  jurisdiction: Id

  /**  */
  id?: string
}

export interface ApplicationFlaggedSetMeta {
  /**  */
  totalCount?: number

  /**  */
  totalResolvedCount?: number

  /**  */
  totalPendingCount?: number

  /**  */
  totalNamePendingCount?: number

  /**  */
  totalEmailPendingCount?: number
}

export interface Address {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  placeName?: string

  /**  */
  city: string

  /**  */
  county?: string

  /**  */
  state: string

  /**  */
  street: string

  /**  */
  street2?: string

  /**  */
  zipCode: string

  /**  */
  latitude?: number

  /**  */
  longitude?: number
}

export interface Applicant {
  /**  */
  address: Address

  /**  */
  workAddress: Address

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  firstName?: string

  /**  */
  middleName?: string

  /**  */
  lastName?: string

  /**  */
  birthMonth?: string

  /**  */
  birthDay?: string

  /**  */
  birthYear?: string

  /**  */
  emailAddress?: string

  /**  */
  noEmail?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  phoneNumberType?: string

  /**  */
  noPhone?: boolean

  /**  */
  workInRegion?: string
}

export interface AlternateContact {
  /**  */
  mailingAddress: Address

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  type?: string

  /**  */
  otherType?: string

  /**  */
  firstName?: string

  /**  */
  lastName?: string

  /**  */
  agency?: string

  /**  */
  phoneNumber?: string

  /**  */
  emailAddress?: string
}

export interface Accessibility {
  /**  */
  mobility?: boolean

  /**  */
  vision?: boolean

  /**  */
  hearing?: boolean

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date
}

export interface Demographics {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  ethnicity?: string

  /**  */
  gender?: string

  /**  */
  sexualOrientation?: string

  /**  */
  howDidYouHear: string[]

  /**  */
  race?: string[]
}

export interface HouseholdMember {
  /**  */
  address: Address

  /**  */
  workAddress: Address

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  orderId?: number

  /**  */
  firstName?: string

  /**  */
  middleName?: string

  /**  */
  lastName?: string

  /**  */
  birthMonth?: string

  /**  */
  birthDay?: string

  /**  */
  birthYear?: string

  /**  */
  emailAddress?: string

  /**  */
  noEmail?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  phoneNumberType?: string

  /**  */
  noPhone?: boolean

  /**  */
  sameAddress?: string

  /**  */
  relationship?: string

  /**  */
  workInRegion?: string
}

export interface UnitType {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  name: string

  /**  */
  numBedrooms: number
}

export interface ApplicationMultiselectQuestionOption {
  /**  */
  key: string

  /**  */
  checked: boolean

  /**  */
  extraData?: AllExtraDataTypes[]
}

export interface ApplicationMultiselectQuestion {
  /**  */
  key: string

  /**  */
  claimed: boolean

  /**  */
  options: ApplicationMultiselectQuestionOption[]
}

export interface Application {
  /**  */
  incomePeriod?: IncomePeriod

  /**  */
  status: ApplicationStatus

  /**  */
  language?: Language

  /**  */
  submissionType: ApplicationSubmissionType

  /**  */
  reviewStatus?: ApplicationReviewStatus

  /**  */
  applicant: Applicant

  /**  */
  listing: Id

  /**  */
  user?: Id

  /**  */
  mailingAddress: Address

  /**  */
  alternateAddress: Address

  /**  */
  alternateContact: AlternateContact

  /**  */
  accessibility: Accessibility

  /**  */
  demographics: Demographics

  /**  */
  householdMembers: HouseholdMember[]

  /**  */
  preferredUnit: UnitType[]

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  deletedAt?: Date

  /**  */
  appUrl?: string

  /**  */
  additionalPhone?: boolean

  /**  */
  additionalPhoneNumber?: string

  /**  */
  additionalPhoneNumberType?: string

  /**  */
  contactPreferences: string[]

  /**  */
  householdSize?: number

  /**  */
  housingStatus?: string

  /**  */
  sendMailToMailingAddress?: boolean

  /**  */
  householdExpectingChanges?: boolean

  /**  */
  householdStudent?: boolean

  /**  */
  incomeVouchers?: boolean

  /**  */
  income?: string

  /**  */
  preferences: ApplicationMultiselectQuestion[]

  /**  */
  programs?: ApplicationMultiselectQuestion[]

  /**  */
  acceptedTerms?: boolean

  /**  */
  submissionDate?: Date

  /**  */
  markedAsDuplicate: boolean

  /**  */
  confirmationCode: string
}

export interface ApplicationFlaggedSet {
  /**  */
  resolvingUser: Id

  /**  */
  applications: Application[]

  /**  */
  listing: Id

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  rule: EnumApplicationFlaggedSetRule

  /**  */
  ruleKey: string

  /**  */
  resolvedTime?: Date

  /**  */
  listingId: string

  /**  */
  showConfirmationAlert: boolean

  /**  */
  status: EnumApplicationFlaggedSetStatus
}

export interface ApplicationFlaggedSetPaginationMeta {
  /**  */
  totalFlagged: number

  /**  */
  currentPage: number

  /**  */
  itemCount: number

  /**  */
  itemsPerPage: number

  /**  */
  totalItems: number

  /**  */
  totalPages: number
}

export interface PaginatedApplicationFlaggedSet {
  /**  */
  items: ApplicationFlaggedSet[]

  /**  */
  meta: ApplicationFlaggedSetPaginationMeta
}

export interface ApplicationFlaggedSetResolve {
  /**  */
  afsId: string

  /**  */
  applications: Id[]

  /**  */
  status: EnumApplicationFlaggedSetResolveStatus
}

export interface Status {
  /**  */
  status: string
}

export interface Asset {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  fileId: string

  /**  */
  label: string
}

export interface PaperApplication {
  /**  */
  language: Language

  /**  */
  file?: CombinedFileTypes

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date
}

export interface ApplicationMethod {
  /**  */
  type: ApplicationMethodType

  /**  */
  paperApplications?: PaperApplication[]

  /**  */
  listing: Id

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  label?: string

  /**  */
  externalReference?: string

  /**  */
  acceptsPostmarkedApplications?: boolean

  /**  */
  phoneNumber?: string
}

export interface AssetCreate {
  /**  */
  fileId: string

  /**  */
  label: string
}

export interface PaperApplicationCreate {
  /**  */
  language: Language

  /**  */
  file?: CombinedFileTypes
}

export interface ApplicationMethodCreate {
  /**  */
  type: ApplicationMethodType

  /**  */
  paperApplications?: PaperApplicationCreate[]

  /**  */
  label?: string

  /**  */
  externalReference?: string

  /**  */
  acceptsPostmarkedApplications?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  listing: Id
}

export interface AssetUpdate {
  /**  */
  id?: string

  /**  */
  fileId: string

  /**  */
  label: string
}

export interface PaperApplicationUpdate {
  /**  */
  language: Language

  /**  */
  id?: string

  /**  */
  file?: CombinedFileTypes
}

export interface ApplicationMethodUpdate {
  /**  */
  type: ApplicationMethodType

  /**  */
  id?: string

  /**  */
  paperApplications?: PaperApplicationUpdate[]

  /**  */
  label?: string

  /**  */
  externalReference?: string

  /**  */
  acceptsPostmarkedApplications?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  listing: Id
}

export interface BooleanInput {
  /**  */
  type: InputType

  /**  */
  key: string

  /**  */
  value: boolean
}

export interface TextInput {
  /**  */
  type: InputType

  /**  */
  key: string

  /**  */
  value: string
}

export interface AddressCreate {
  /**  */
  placeName?: string

  /**  */
  city: string

  /**  */
  county?: string

  /**  */
  state: string

  /**  */
  street: string

  /**  */
  street2?: string

  /**  */
  zipCode: string

  /**  */
  latitude?: number

  /**  */
  longitude?: number
}

export interface AddressInput {
  /**  */
  type: InputType

  /**  */
  key: string

  /**  */
  value: AddressCreate
}

export interface ApplicationsApiExtraModel {
  /**  */
  orderBy?: EnumApplicationsApiExtraModelOrderBy

  /**  */
  order?: EnumApplicationsApiExtraModelOrder
}

export interface PaginationMeta {
  /**  */
  currentPage: number

  /**  */
  itemCount: number

  /**  */
  itemsPerPage: number

  /**  */
  totalItems: number

  /**  */
  totalPages: number
}

export interface PaginatedApplication {
  /**  */
  items: Application[]

  /**  */
  meta: PaginationMeta
}

export interface ApplicantCreate {
  /**  */
  address: AddressCreate

  /**  */
  workAddress: AddressCreate

  /**  */
  firstName?: string

  /**  */
  middleName?: string

  /**  */
  lastName?: string

  /**  */
  birthMonth?: string

  /**  */
  birthDay?: string

  /**  */
  birthYear?: string

  /**  */
  emailAddress?: string

  /**  */
  noEmail?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  phoneNumberType?: string

  /**  */
  noPhone?: boolean

  /**  */
  workInRegion?: string
}

export interface AlternateContactCreate {
  /**  */
  mailingAddress: AddressCreate

  /**  */
  type?: string

  /**  */
  otherType?: string

  /**  */
  firstName?: string

  /**  */
  lastName?: string

  /**  */
  agency?: string

  /**  */
  phoneNumber?: string

  /**  */
  emailAddress?: string
}

export interface AccessibilityCreate {
  /**  */
  mobility?: boolean

  /**  */
  vision?: boolean

  /**  */
  hearing?: boolean
}

export interface DemographicsCreate {
  /**  */
  ethnicity?: string

  /**  */
  gender?: string

  /**  */
  sexualOrientation?: string

  /**  */
  howDidYouHear: string[]

  /**  */
  race?: string[]
}

export interface HouseholdMemberCreate {
  /**  */
  address: AddressCreate

  /**  */
  workAddress: AddressCreate

  /**  */
  orderId?: number

  /**  */
  firstName?: string

  /**  */
  middleName?: string

  /**  */
  lastName?: string

  /**  */
  birthMonth?: string

  /**  */
  birthDay?: string

  /**  */
  birthYear?: string

  /**  */
  emailAddress?: string

  /**  */
  noEmail?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  phoneNumberType?: string

  /**  */
  noPhone?: boolean

  /**  */
  sameAddress?: string

  /**  */
  relationship?: string

  /**  */
  workInRegion?: string
}

export interface ApplicationCreate {
  /**  */
  incomePeriod?: IncomePeriod

  /**  */
  status: ApplicationStatus

  /**  */
  language?: Language

  /**  */
  submissionType: ApplicationSubmissionType

  /**  */
  reviewStatus?: ApplicationReviewStatus

  /**  */
  listing: Id

  /**  */
  applicant: ApplicantCreate

  /**  */
  mailingAddress: AddressCreate

  /**  */
  alternateAddress: AddressCreate

  /**  */
  alternateContact: AlternateContactCreate

  /**  */
  accessibility: AccessibilityCreate

  /**  */
  demographics: DemographicsCreate

  /**  */
  householdMembers: HouseholdMemberCreate[]

  /**  */
  preferredUnit: Id[]

  /**  */
  appUrl?: string

  /**  */
  additionalPhone?: boolean

  /**  */
  additionalPhoneNumber?: string

  /**  */
  additionalPhoneNumberType?: string

  /**  */
  contactPreferences: string[]

  /**  */
  householdSize?: number

  /**  */
  housingStatus?: string

  /**  */
  sendMailToMailingAddress?: boolean

  /**  */
  householdExpectingChanges?: boolean

  /**  */
  householdStudent?: boolean

  /**  */
  incomeVouchers?: boolean

  /**  */
  income?: string

  /**  */
  preferences: ApplicationMultiselectQuestion[]

  /**  */
  programs?: ApplicationMultiselectQuestion[]

  /**  */
  acceptedTerms?: boolean

  /**  */
  submissionDate?: Date
}

export interface AddressUpdate {
  /**  */
  id?: string

  /**  */
  createdAt?: Date

  /**  */
  updatedAt?: Date

  /**  */
  placeName?: string

  /**  */
  city: string

  /**  */
  county?: string

  /**  */
  state: string

  /**  */
  street: string

  /**  */
  street2?: string

  /**  */
  zipCode: string

  /**  */
  latitude?: number

  /**  */
  longitude?: number
}

export interface ApplicantUpdate {
  /**  */
  id?: string

  /**  */
  createdAt?: Date

  /**  */
  updatedAt?: Date

  /**  */
  address: AddressUpdate

  /**  */
  workAddress: AddressUpdate

  /**  */
  firstName?: string

  /**  */
  middleName?: string

  /**  */
  lastName?: string

  /**  */
  birthMonth?: string

  /**  */
  birthDay?: string

  /**  */
  birthYear?: string

  /**  */
  emailAddress?: string

  /**  */
  noEmail?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  phoneNumberType?: string

  /**  */
  noPhone?: boolean

  /**  */
  workInRegion?: string
}

export interface AlternateContactUpdate {
  /**  */
  id?: string

  /**  */
  createdAt?: Date

  /**  */
  updatedAt?: Date

  /**  */
  mailingAddress: AddressUpdate

  /**  */
  type?: string

  /**  */
  otherType?: string

  /**  */
  firstName?: string

  /**  */
  lastName?: string

  /**  */
  agency?: string

  /**  */
  phoneNumber?: string

  /**  */
  emailAddress?: string
}

export interface AccessibilityUpdate {
  /**  */
  id?: string

  /**  */
  createdAt?: Date

  /**  */
  updatedAt?: Date

  /**  */
  mobility?: boolean

  /**  */
  vision?: boolean

  /**  */
  hearing?: boolean
}

export interface DemographicsUpdate {
  /**  */
  id?: string

  /**  */
  createdAt?: Date

  /**  */
  updatedAt?: Date

  /**  */
  ethnicity?: string

  /**  */
  gender?: string

  /**  */
  sexualOrientation?: string

  /**  */
  howDidYouHear: string[]

  /**  */
  race?: string[]
}

export interface HouseholdMemberUpdate {
  /**  */
  id?: string

  /**  */
  createdAt?: Date

  /**  */
  updatedAt?: Date

  /**  */
  address: AddressUpdate

  /**  */
  workAddress: AddressUpdate

  /**  */
  orderId?: number

  /**  */
  firstName?: string

  /**  */
  middleName?: string

  /**  */
  lastName?: string

  /**  */
  birthMonth?: string

  /**  */
  birthDay?: string

  /**  */
  birthYear?: string

  /**  */
  emailAddress?: string

  /**  */
  noEmail?: boolean

  /**  */
  phoneNumber?: string

  /**  */
  phoneNumberType?: string

  /**  */
  noPhone?: boolean

  /**  */
  sameAddress?: string

  /**  */
  relationship?: string

  /**  */
  workInRegion?: string
}

export interface ApplicationUpdate {
  /**  */
  incomePeriod?: IncomePeriod

  /**  */
  status: ApplicationStatus

  /**  */
  language?: Language

  /**  */
  submissionType: ApplicationSubmissionType

  /**  */
  reviewStatus?: ApplicationReviewStatus

  /**  */
  id?: string

  /**  */
  deletedAt?: Date

  /**  */
  listing: Id

  /**  */
  applicant: ApplicantUpdate

  /**  */
  mailingAddress: AddressUpdate

  /**  */
  alternateAddress: AddressUpdate

  /**  */
  alternateContact: AlternateContactUpdate

  /**  */
  accessibility: AccessibilityUpdate

  /**  */
  demographics: DemographicsUpdate

  /**  */
  householdMembers: HouseholdMemberUpdate[]

  /**  */
  preferredUnit: Id[]

  /**  */
  appUrl?: string

  /**  */
  additionalPhone?: boolean

  /**  */
  additionalPhoneNumber?: string

  /**  */
  additionalPhoneNumberType?: string

  /**  */
  contactPreferences: string[]

  /**  */
  householdSize?: number

  /**  */
  housingStatus?: string

  /**  */
  sendMailToMailingAddress?: boolean

  /**  */
  householdExpectingChanges?: boolean

  /**  */
  householdStudent?: boolean

  /**  */
  incomeVouchers?: boolean

  /**  */
  income?: string

  /**  */
  preferences: ApplicationMultiselectQuestion[]

  /**  */
  programs?: ApplicationMultiselectQuestion[]

  /**  */
  acceptedTerms?: boolean

  /**  */
  submissionDate?: Date
}

export interface CreatePresignedUploadMetadata {
  /**  */
  parametersToSign: object
}

export interface CreatePresignedUploadMetadataResponse {
  /**  */
  signature: string
}

export interface PaginatedAssets {
  /**  */
  items: Asset[]

  /**  */
  meta: PaginationMeta
}

export interface UserErrorExtraModel {
  /**  */
  userErrorMessages: EnumUserErrorExtraModelUserErrorMessages
}

export interface Login {
  /**  */
  email: string

  /**  */
  password: string

  /**  */
  mfaCode?: string

  /**  */
  mfaType?: EnumLoginMfaType
}

export interface LoginResponse {
  /**  */
  accessToken: string
}

export interface Token {}

export interface RequestMfaCode {
  /**  */
  email: string

  /**  */
  password: string

  /**  */
  mfaType: EnumRequestMfaCodeMfaType

  /**  */
  phoneNumber?: string
}

export interface RequestMfaCodeResponse {
  /**  */
  phoneNumber?: string

  /**  */
  email?: string

  /**  */
  phoneNumberVerified?: boolean
}

export interface GetMfaInfo {
  /**  */
  email: string

  /**  */
  password: string
}

export interface GetMfaInfoResponse {
  /**  */
  phoneNumber?: string

  /**  */
  email?: string

  /**  */
  isMfaEnabled: boolean

  /**  */
  mfaUsedInThePast: boolean
}

export interface IdName {
  /**  */
  id: string

  /**  */
  name: string
}

export interface UserRoles {
  /**  */
  user: Id

  /**  */
  isAdmin?: boolean

  /**  */
  isJurisdictionalAdmin?: boolean

  /**  */
  isPartner?: boolean
}

export interface Jurisdiction {
  /**  */
  multiselectQuestions: Id[]

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  name: string

  /**  */
  notificationsSignUpURL?: string

  /**  */
  languages: EnumJurisdictionLanguages[]

  /**  */
  partnerTerms?: string

  /**  */
  publicUrl: string

  /**  */
  emailFromAddress: string

  /**  */
  rentalAssistanceDefault: string

  /**  */
  enablePartnerSettings?: boolean

  /**  */
  enableAccessibilityFeatures: boolean

  /**  */
  enableUtilitiesIncluded: boolean
}

export interface User {
  /**  */
  language?: Language

  /**  */
  leasingAgentInListings?: IdName[]

  /**  */
  roles?: CombinedRolesTypes

  /**  */
  jurisdictions: Jurisdiction[]

  /**  */
  id: string

  /**  */
  passwordUpdatedAt: Date

  /**  */
  passwordValidForDays: number

  /**  */
  confirmedAt?: Date

  /**  */
  email: string

  /**  */
  firstName: string

  /**  */
  middleName?: string

  /**  */
  lastName: string

  /**  */
  dob?: Date

  /**  */
  phoneNumber?: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  mfaEnabled?: boolean

  /**  */
  lastLoginAt?: Date

  /**  */
  failedLoginAttemptsCount?: number

  /**  */
  phoneNumberVerified?: boolean

  /**  */
  agreedToTermsOfService: boolean

  /**  */
  hitConfirmationURL?: Date
}

export interface UserCreate {
  /**  */
  language?: Language

  /**  */
  password: string

  /**  */
  passwordConfirmation: string

  /**  */
  emailConfirmation: string

  /**  */
  appUrl?: string

  /**  */
  jurisdictions?: Id[]

  /**  */
  email: string

  /**  */
  confirmedAt?: Date

  /**  */
  firstName: string

  /**  */
  middleName?: string

  /**  */
  lastName: string

  /**  */
  dob?: Date

  /**  */
  phoneNumber?: string

  /**  */
  phoneNumberVerified?: boolean

  /**  */
  hitConfirmationURL?: Date
}

export interface UserBasic {
  /**  */
  language?: Language

  /**  */
  roles: UserRoles

  /**  */
  jurisdictions: Jurisdiction[]

  /**  */
  leasingAgentInListings?: Id[]

  /**  */
  id: string

  /**  */
  passwordUpdatedAt: Date

  /**  */
  passwordValidForDays: number

  /**  */
  confirmedAt?: Date

  /**  */
  email: string

  /**  */
  firstName: string

  /**  */
  middleName?: string

  /**  */
  lastName: string

  /**  */
  dob?: Date

  /**  */
  phoneNumber?: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  mfaEnabled?: boolean

  /**  */
  lastLoginAt?: Date

  /**  */
  failedLoginAttemptsCount?: number

  /**  */
  phoneNumberVerified?: boolean

  /**  */
  agreedToTermsOfService: boolean

  /**  */
  hitConfirmationURL?: Date
}

export interface Email {
  /**  */
  email: string

  /**  */
  appUrl?: string
}

export interface Confirm {
  /**  */
  token: string

  /**  */
  password?: string
}

export interface ForgotPassword {
  /**  */
  email: string

  /**  */
  appUrl?: string
}

export interface ForgotPasswordResponse {
  /**  */
  message: string
}

export interface UpdatePassword {
  /**  */
  password: string

  /**  */
  passwordConfirmation: string

  /**  */
  token: string
}

export interface UserRolesOnly {
  /**  */
  isAdmin?: boolean

  /**  */
  isJurisdictionalAdmin?: boolean

  /**  */
  isPartner?: boolean
}

export interface UserUpdate {
  /**  */
  language?: Language

  /**  */
  id?: string

  /**  */
  email?: string

  /**  */
  password?: string

  /**  */
  currentPassword?: string

  /**  */
  leasingAgentInListings?: Id[]

  /**  */
  newEmail?: string

  /**  */
  appUrl?: string

  /**  */
  jurisdictions: Id[]

  /**  */
  roles?: UserRolesOnly

  /**  */
  confirmedAt?: Date

  /**  */
  firstName: string

  /**  */
  middleName?: string

  /**  */
  lastName: string

  /**  */
  dob?: Date

  /**  */
  phoneNumber?: string

  /**  */
  phoneNumberVerified?: boolean

  /**  */
  agreedToTermsOfService: boolean

  /**  */
  hitConfirmationURL?: Date
}

export interface UserFilterParams {
  /**  */
  $comparison: EnumUserFilterParamsComparison

  /**  */
  isPartner?: boolean

  /**  */
  isPortalUser?: boolean
}

export interface PaginatedUserList {
  /**  */
  items: User[]

  /**  */
  meta: PaginationMeta
}

export interface UserRolesCreate {
  /**  */
  isAdmin?: boolean

  /**  */
  isJurisdictionalAdmin?: boolean

  /**  */
  isPartner?: boolean
}

export interface UserInvite {
  /**  */
  language?: Language

  /**  */
  jurisdictions: Id[]

  /**  */
  leasingAgentInListings?: Id[]

  /**  */
  roles?: UserRolesCreate

  /**  */
  confirmedAt?: Date

  /**  */
  email: string

  /**  */
  firstName: string

  /**  */
  middleName?: string

  /**  */
  lastName: string

  /**  */
  dob?: Date

  /**  */
  phoneNumber?: string

  /**  */
  phoneNumberVerified?: boolean

  /**  */
  hitConfirmationURL?: Date
}

export interface UserProfileUpdate {
  /**  */
  language?: Language

  /**  */
  password?: string

  /**  */
  currentPassword?: string

  /**  */
  jurisdictions: Id[]

  /**  */
  newEmail?: string

  /**  */
  appUrl?: string

  /**  */
  id: string

  /**  */
  firstName: string

  /**  */
  middleName?: string

  /**  */
  lastName: string

  /**  */
  dob?: Date

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  phoneNumber?: string

  /**  */
  agreedToTermsOfService: boolean
}

export interface JurisdictionCreate {
  /**  */
  name: string

  /**  */
  notificationsSignUpURL?: string

  /**  */
  languages: EnumJurisdictionCreateLanguages[]

  /**  */
  partnerTerms?: string

  /**  */
  publicUrl: string

  /**  */
  emailFromAddress: string

  /**  */
  rentalAssistanceDefault: string

  /**  */
  enablePartnerSettings?: boolean

  /**  */
  enableAccessibilityFeatures: boolean

  /**  */
  enableUtilitiesIncluded: boolean

  /**  */
  multiselectQuestions: Id[]
}

export interface JurisdictionUpdate {
  /**  */
  id?: string

  /**  */
  name: string

  /**  */
  notificationsSignUpURL?: string

  /**  */
  languages: EnumJurisdictionUpdateLanguages[]

  /**  */
  partnerTerms?: string

  /**  */
  publicUrl: string

  /**  */
  emailFromAddress: string

  /**  */
  rentalAssistanceDefault: string

  /**  */
  enablePartnerSettings?: boolean

  /**  */
  enableAccessibilityFeatures: boolean

  /**  */
  enableUtilitiesIncluded: boolean

  /**  */
  multiselectQuestions: Id[]
}

export interface ListingFilterParams {
  /**  */
  $comparison: EnumListingFilterParamsComparison

  /**  */
  name?: string

  /**  */
  status?: EnumListingFilterParamsStatus

  /**  */
  neighborhood?: string

  /**  */
  bedrooms?: number

  /**  */
  zipcode?: string

  /**  */
  leasingAgents?: string

  /**  */
  jurisdiction?: string
}

export interface ListingsApiExtraModels {
  /**  */
  orderBy?: OrderByFieldsEnum[]

  /**  */
  orderDir?: OrderParam[]
}

export interface UnitAccessibilityPriorityType {
  /**  */
  name: string

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date
}

export interface MinMaxCurrency {
  /**  */
  min: string

  /**  */
  max: string
}

export interface MinMax {
  /**  */
  min: number

  /**  */
  max: number
}

export interface UnitSummary {
  /**  */
  unitType: UnitType

  /**  */
  minIncomeRange: MinMaxCurrency

  /**  */
  occupancyRange: MinMax

  /**  */
  rentAsPercentIncomeRange: MinMax

  /**  */
  rentRange: MinMaxCurrency

  /**  */
  totalAvailable: number

  /**  */
  areaRange: MinMax

  /**  */
  floorRange?: MinMax
}

export interface UnitSummaryByAMI {
  /**  */
  percent: string

  /**  */
  byUnitType: UnitSummary[]
}

export interface HMI {
  /**  */
  columns: object

  /**  */
  rows: object[]
}

export interface UnitsSummarized {
  /**  */
  unitTypes: UnitType[]

  /**  */
  priorityTypes: UnitAccessibilityPriorityType[]

  /**  */
  amiPercentages: string[]

  /**  */
  byUnitTypeAndRent: UnitSummary[]

  /**  */
  byUnitType: UnitSummary[]

  /**  */
  byAMI: UnitSummaryByAMI[]

  /**  */
  hmi: HMI
}

export interface Asset {
  /**  */
  fileId: string

  /**  */
  label: string

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date
}

export interface ListingEvent {
  /**  */
  type: ListingEventType

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  startTime?: Date

  /**  */
  endTime?: Date

  /**  */
  url?: string

  /**  */
  note?: string

  /**  */
  label?: string

  /**  */
  file?: Asset
}

export interface ListingImage {
  /**  */
  image: AssetUpdate

  /**  */
  ordinal?: number
}

export interface MultiselectLink {
  /**  */
  title: string

  /**  */
  url: string
}

export interface MultiselectOption {
  /**  */
  text: string

  /**  */
  ordinal: number

  /**  */
  description?: string

  /**  */
  links?: MultiselectLink[]

  /**  */
  collectAddress?: boolean

  /**  */
  exclusive?: boolean
}

export interface MultiselectQuestion {
  /**  */
  links?: MultiselectLink[]

  /**  */
  options?: MultiselectOption[]

  /**  */
  hideFromListing?: boolean

  /**  */
  applicationSection: ApplicationSection

  /**  */
  jurisdictions?: IdName[]

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  text: string

  /**  */
  subText?: string

  /**  */
  description?: string

  /**  */
  optOutText?: string
}

export interface ListingMultiselectQuestion {
  /**  */
  multiselectQuestion: MultiselectQuestion

  /**  */
  ordinal?: number
}

export interface JurisdictionSlim {
  /**  */
  id: string

  /**  */
  name: string

  /**  */
  publicUrl: string
}

export interface ReservedCommunityType {
  /**  */
  jurisdiction: Jurisdiction

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  name: string

  /**  */
  description?: string
}

export interface UnitRentType {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  name: string
}

export interface UnitAccessibilityPriorityType {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  name: string
}

export interface UnitAmiChartOverride {
  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  items: AmiChartItem[]
}

export interface Unit {
  /**  */
  amiChart?: Id

  /**  */
  unitType?: UnitType

  /**  */
  unitRentType?: UnitRentType

  /**  */
  priorityType?: UnitAccessibilityPriorityType

  /**  */
  amiChartOverride?: UnitAmiChartOverride

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  amiPercentage?: string

  /**  */
  annualIncomeMin?: string

  /**  */
  monthlyIncomeMin?: string

  /**  */
  floor?: number

  /**  */
  annualIncomeMax?: string

  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  monthlyRent?: string

  /**  */
  numBathrooms?: number

  /**  */
  numBedrooms?: number

  /**  */
  number?: string

  /**  */
  sqFeet?: string

  /**  */
  monthlyRentAsPercentOfIncome?: string

  /**  */
  bmrProgramChart?: boolean
}

export interface UnitsSummary {
  /**  */
  listing: Id

  /**  */
  unitType: Id

  /**  */
  id: string

  /**  */
  monthlyRentMin?: number

  /**  */
  monthlyRentMax?: number

  /**  */
  monthlyRentAsPercentOfIncome?: string

  /**  */
  amiPercentage?: number

  /**  */
  minimumIncomeMin?: string

  /**  */
  minimumIncomeMax?: string

  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  floorMin?: number

  /**  */
  floorMax?: number

  /**  */
  sqFeetMin?: string

  /**  */
  sqFeetMax?: string

  /**  */
  priorityType?: CombinedPriorityTypeTypes

  /**  */
  totalCount?: number

  /**  */
  totalAvailable?: number
}

export interface ListingFeatures {
  /**  */
  elevator?: boolean

  /**  */
  wheelchairRamp?: boolean

  /**  */
  serviceAnimalsAllowed?: boolean

  /**  */
  accessibleParking?: boolean

  /**  */
  parkingOnSite?: boolean

  /**  */
  inUnitWasherDryer?: boolean

  /**  */
  laundryInBuilding?: boolean

  /**  */
  barrierFreeEntrance?: boolean

  /**  */
  rollInShower?: boolean

  /**  */
  grabBars?: boolean

  /**  */
  heatingInUnit?: boolean

  /**  */
  acInUnit?: boolean

  /**  */
  hearing?: boolean

  /**  */
  visual?: boolean

  /**  */
  mobility?: boolean
}

export interface ListingUtilities {
  /**  */
  water?: boolean

  /**  */
  gas?: boolean

  /**  */
  trash?: boolean

  /**  */
  sewer?: boolean

  /**  */
  electricity?: boolean

  /**  */
  cable?: boolean

  /**  */
  phone?: boolean

  /**  */
  internet?: boolean
}

export interface Listing {
  /**  */
  referralApplication?: ApplicationMethod

  /**  */
  applicationPickUpAddressType?: ListingApplicationAddressType

  /**  */
  applicationDropOffAddressType?: ListingApplicationAddressType

  /**  */
  applicationMailingAddressType?: ListingApplicationAddressType

  /**  */
  status: ListingStatus

  /**  */
  reviewOrderType?: ListingReviewOrder

  /**  */
  listingAvailability?: ListingAvailability

  /**  */
  showWaitlist: boolean

  /**  */
  unitsSummarized: UnitsSummarized

  /**  */
  applicationMethods: ApplicationMethod[]

  /**  */
  applicationPickUpAddress?: CombinedApplicationPickUpAddressTypes

  /**  */
  applicationDropOffAddress: CombinedApplicationDropOffAddressTypes

  /**  */
  applicationMailingAddress: CombinedApplicationMailingAddressTypes

  /**  */
  buildingSelectionCriteriaFile?: CombinedBuildingSelectionCriteriaFileTypes

  /**  */
  events: ListingEvent[]

  /**  */
  images?: ListingImage[]

  /**  */
  leasingAgentAddress?: CombinedLeasingAgentAddressTypes

  /**  */
  leasingAgents?: UserBasic[]

  /**  */
  listingMultiselectQuestions: ListingMultiselectQuestion[]

  /**  */
  jurisdiction: JurisdictionSlim

  /**  */
  reservedCommunityType?: ReservedCommunityType

  /**  */
  result?: CombinedResultTypes

  /**  */
  units: Unit[]

  /**  */
  accessibility?: string

  /**  */
  amenities?: string

  /**  */
  buildingAddress: Address

  /**  */
  buildingTotalUnits?: number

  /**  */
  developer?: string

  /**  */
  householdSizeMax?: number

  /**  */
  householdSizeMin?: number

  /**  */
  neighborhood?: string

  /**  */
  petPolicy?: string

  /**  */
  smokingPolicy?: string

  /**  */
  unitsAvailable?: number

  /**  */
  unitAmenities?: string

  /**  */
  servicesOffered?: string

  /**  */
  yearBuilt?: number

  /**  */
  urlSlug: string

  /**  */
  unitsSummary?: UnitsSummary[]

  /**  */
  countyCode?: string

  /**  */
  features?: ListingFeatures

  /**  */
  utilities?: ListingUtilities

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  additionalApplicationSubmissionNotes?: string

  /**  */
  digitalApplication?: boolean

  /**  */
  commonDigitalApplication?: boolean

  /**  */
  paperApplication?: boolean

  /**  */
  referralOpportunity?: boolean

  /**  */
  assets: AssetCreate[]

  /**  */
  applicationDueDate?: Date

  /**  */
  applicationOpenDate?: Date

  /**  */
  applicationFee?: string

  /**  */
  applicationOrganization?: string

  /**  */
  applicationPickUpAddressOfficeHours?: string

  /**  */
  applicationDropOffAddressOfficeHours?: string

  /**  */
  buildingSelectionCriteria?: string

  /**  */
  costsNotIncluded?: string

  /**  */
  creditHistory?: string

  /**  */
  criminalBackground?: string

  /**  */
  depositMin?: string

  /**  */
  depositMax?: string

  /**  */
  depositHelperText?: string

  /**  */
  disableUnitsAccordion?: boolean

  /**  */
  leasingAgentEmail?: string

  /**  */
  leasingAgentName?: string

  /**  */
  leasingAgentOfficeHours?: string

  /**  */
  leasingAgentPhone?: string

  /**  */
  leasingAgentTitle?: string

  /**  */
  name: string

  /**  */
  postmarkedApplicationsReceivedByDate?: Date

  /**  */
  programRules?: string

  /**  */
  rentalAssistance?: string

  /**  */
  rentalHistory?: string

  /**  */
  requiredDocuments?: string

  /**  */
  specialNotes?: string

  /**  */
  waitlistCurrentSize?: number

  /**  */
  waitlistMaxSize?: number

  /**  */
  whatToExpect?: string

  /**  */
  applicationConfig?: object

  /**  */
  displayWaitlistSize: boolean

  /**  */
  reservedCommunityDescription?: string

  /**  */
  reservedCommunityMinAge?: number

  /**  */
  resultLink?: string

  /**  */
  isWaitlistOpen?: boolean

  /**  */
  waitlistOpenSpots?: number

  /**  */
  customMapPin?: boolean

  /**  */
  publishedAt?: Date

  /**  */
  closedAt?: Date

  /**  */
  afsLastRunAt?: Date

  /**  */
  lastApplicationUpdateAt?: Date
}

export interface PaginatedListing {
  /**  */
  items: Listing[]

  /**  */
  meta: PaginationMeta
}

export interface ListingEventCreate {
  /**  */
  type: ListingEventType

  /**  */
  file?: AssetCreate

  /**  */
  startTime?: Date

  /**  */
  endTime?: Date

  /**  */
  url?: string

  /**  */
  note?: string

  /**  */
  label?: string
}

export interface ListingImageUpdate {
  /**  */
  image: AssetUpdate

  /**  */
  ordinal?: number
}

export interface UnitAmiChartOverrideCreate {
  /**  */
  items: AmiChartItem[]
}

export interface UnitCreate {
  /**  */
  amiChart?: Id

  /**  */
  unitType?: Id

  /**  */
  unitRentType?: Id

  /**  */
  priorityType?: Id

  /**  */
  amiChartOverride?: UnitAmiChartOverrideCreate

  /**  */
  amiPercentage?: string

  /**  */
  annualIncomeMin?: string

  /**  */
  monthlyIncomeMin?: string

  /**  */
  floor?: number

  /**  */
  annualIncomeMax?: string

  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  monthlyRent?: string

  /**  */
  numBathrooms?: number

  /**  */
  numBedrooms?: number

  /**  */
  number?: string

  /**  */
  sqFeet?: string

  /**  */
  monthlyRentAsPercentOfIncome?: string

  /**  */
  bmrProgramChart?: boolean
}

export interface UnitsSummaryCreate {
  /**  */
  monthlyRentMin?: number

  /**  */
  monthlyRentMax?: number

  /**  */
  monthlyRentAsPercentOfIncome?: string

  /**  */
  amiPercentage?: number

  /**  */
  minimumIncomeMin?: string

  /**  */
  minimumIncomeMax?: string

  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  floorMin?: number

  /**  */
  floorMax?: number

  /**  */
  sqFeetMin?: string

  /**  */
  sqFeetMax?: string

  /**  */
  priorityType?: CombinedPriorityTypeTypes

  /**  */
  totalCount?: number

  /**  */
  totalAvailable?: number

  /**  */
  listing: Id

  /**  */
  unitType: Id
}

export interface ListingMultiselectQuestionUpdate {
  /**  */
  multiselectQuestion: Id

  /**  */
  ordinal?: number
}

export interface ListingCreate {
  /**  */
  applicationPickUpAddressType?: ListingApplicationAddressType

  /**  */
  applicationDropOffAddressType?: ListingApplicationAddressType

  /**  */
  applicationMailingAddressType?: ListingApplicationAddressType

  /**  */
  status: ListingStatus

  /**  */
  reviewOrderType?: ListingReviewOrder

  /**  */
  listingAvailability?: ListingAvailability

  /**  */
  applicationMethods: ApplicationMethodCreate[]

  /**  */
  applicationPickUpAddress?: CombinedApplicationPickUpAddressTypes

  /**  */
  applicationDropOffAddress: CombinedApplicationDropOffAddressTypes

  /**  */
  applicationMailingAddress: CombinedApplicationMailingAddressTypes

  /**  */
  buildingSelectionCriteriaFile?: CombinedBuildingSelectionCriteriaFileTypes

  /**  */
  events: ListingEventCreate[]

  /**  */
  images?: ListingImageUpdate[]

  /**  */
  leasingAgentAddress?: CombinedLeasingAgentAddressTypes

  /**  */
  leasingAgents?: Id[]

  /**  */
  units: UnitCreate[]

  /**  */
  buildingAddress?: CombinedBuildingAddressTypes

  /**  */
  jurisdiction: Id

  /**  */
  reservedCommunityType?: Id

  /**  */
  result?: CombinedResultTypes

  /**  */
  unitsSummary?: UnitsSummaryCreate[]

  /**  */
  listingMultiselectQuestions: ListingMultiselectQuestionUpdate[]

  /**  */
  additionalApplicationSubmissionNotes?: string

  /**  */
  digitalApplication?: boolean

  /**  */
  commonDigitalApplication?: boolean

  /**  */
  paperApplication?: boolean

  /**  */
  referralOpportunity?: boolean

  /**  */
  assets: AssetCreate[]

  /**  */
  accessibility?: string

  /**  */
  amenities?: string

  /**  */
  buildingTotalUnits?: number

  /**  */
  developer?: string

  /**  */
  householdSizeMax?: number

  /**  */
  householdSizeMin?: number

  /**  */
  neighborhood?: string

  /**  */
  petPolicy?: string

  /**  */
  smokingPolicy?: string

  /**  */
  unitsAvailable?: number

  /**  */
  unitAmenities?: string

  /**  */
  servicesOffered?: string

  /**  */
  yearBuilt?: number

  /**  */
  applicationDueDate?: Date

  /**  */
  applicationOpenDate?: Date

  /**  */
  applicationFee?: string

  /**  */
  applicationOrganization?: string

  /**  */
  applicationPickUpAddressOfficeHours?: string

  /**  */
  applicationDropOffAddressOfficeHours?: string

  /**  */
  buildingSelectionCriteria?: string

  /**  */
  costsNotIncluded?: string

  /**  */
  creditHistory?: string

  /**  */
  criminalBackground?: string

  /**  */
  depositMin?: string

  /**  */
  depositMax?: string

  /**  */
  depositHelperText?: string

  /**  */
  disableUnitsAccordion?: boolean

  /**  */
  leasingAgentEmail?: string

  /**  */
  leasingAgentName?: string

  /**  */
  leasingAgentOfficeHours?: string

  /**  */
  leasingAgentPhone?: string

  /**  */
  leasingAgentTitle?: string

  /**  */
  name: string

  /**  */
  postmarkedApplicationsReceivedByDate?: Date

  /**  */
  programRules?: string

  /**  */
  rentalAssistance?: string

  /**  */
  rentalHistory?: string

  /**  */
  requiredDocuments?: string

  /**  */
  specialNotes?: string

  /**  */
  waitlistCurrentSize?: number

  /**  */
  waitlistMaxSize?: number

  /**  */
  whatToExpect?: string

  /**  */
  applicationConfig?: object

  /**  */
  displayWaitlistSize: boolean

  /**  */
  reservedCommunityDescription?: string

  /**  */
  reservedCommunityMinAge?: number

  /**  */
  resultLink?: string

  /**  */
  isWaitlistOpen?: boolean

  /**  */
  waitlistOpenSpots?: number

  /**  */
  customMapPin?: boolean

  /**  */
  lastApplicationUpdateAt?: Date

  /**  */
  countyCode?: string

  /**  */
  features?: ListingFeatures

  /**  */
  utilities?: ListingUtilities
}

export interface ListingEventUpdate {
  /**  */
  type: ListingEventType

  /**  */
  id?: string

  /**  */
  file?: AssetUpdate

  /**  */
  startTime?: Date

  /**  */
  endTime?: Date

  /**  */
  url?: string

  /**  */
  note?: string

  /**  */
  label?: string
}

export interface UnitAmiChartOverrideUpdate {
  /**  */
  id?: string

  /**  */
  items: AmiChartItem[]
}

export interface UnitUpdate {
  /**  */
  id?: string

  /**  */
  amiChart?: Id

  /**  */
  unitType?: Id

  /**  */
  unitRentType?: Id

  /**  */
  priorityType?: Id

  /**  */
  amiChartOverride?: UnitAmiChartOverrideUpdate

  /**  */
  amiPercentage?: string

  /**  */
  annualIncomeMin?: string

  /**  */
  monthlyIncomeMin?: string

  /**  */
  floor?: number

  /**  */
  annualIncomeMax?: string

  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  monthlyRent?: string

  /**  */
  numBathrooms?: number

  /**  */
  numBedrooms?: number

  /**  */
  number?: string

  /**  */
  sqFeet?: string

  /**  */
  monthlyRentAsPercentOfIncome?: string

  /**  */
  bmrProgramChart?: boolean
}

export interface UnitsSummaryUpdate {
  /**  */
  id: string

  /**  */
  monthlyRentMin?: number

  /**  */
  monthlyRentMax?: number

  /**  */
  monthlyRentAsPercentOfIncome?: string

  /**  */
  amiPercentage?: number

  /**  */
  minimumIncomeMin?: string

  /**  */
  minimumIncomeMax?: string

  /**  */
  maxOccupancy?: number

  /**  */
  minOccupancy?: number

  /**  */
  floorMin?: number

  /**  */
  floorMax?: number

  /**  */
  sqFeetMin?: string

  /**  */
  sqFeetMax?: string

  /**  */
  priorityType?: CombinedPriorityTypeTypes

  /**  */
  totalCount?: number

  /**  */
  totalAvailable?: number

  /**  */
  listing: Id

  /**  */
  unitType: Id
}

export interface ListingUpdate {
  /**  */
  applicationPickUpAddressType?: ListingApplicationAddressType

  /**  */
  applicationDropOffAddressType?: ListingApplicationAddressType

  /**  */
  applicationMailingAddressType?: ListingApplicationAddressType

  /**  */
  status: ListingStatus

  /**  */
  reviewOrderType?: ListingReviewOrder

  /**  */
  listingAvailability?: ListingAvailability

  /**  */
  id?: string

  /**  */
  applicationMethods: ApplicationMethodUpdate[]

  /**  */
  applicationPickUpAddress?: CombinedApplicationPickUpAddressTypes

  /**  */
  applicationDropOffAddress: CombinedApplicationDropOffAddressTypes

  /**  */
  applicationMailingAddress: CombinedApplicationMailingAddressTypes

  /**  */
  buildingSelectionCriteriaFile?: CombinedBuildingSelectionCriteriaFileTypes

  /**  */
  events: ListingEventUpdate[]

  /**  */
  images?: ListingImageUpdate[]

  /**  */
  leasingAgentAddress?: CombinedLeasingAgentAddressTypes

  /**  */
  leasingAgents?: Id[]

  /**  */
  units: UnitUpdate[]

  /**  */
  buildingAddress?: CombinedBuildingAddressTypes

  /**  */
  jurisdiction: Id

  /**  */
  reservedCommunityType?: Id

  /**  */
  result?: AssetUpdate

  /**  */
  unitsSummary?: UnitsSummaryUpdate[]

  /**  */
  listingMultiselectQuestions: ListingMultiselectQuestionUpdate[]

  /**  */
  additionalApplicationSubmissionNotes?: string

  /**  */
  digitalApplication?: boolean

  /**  */
  commonDigitalApplication?: boolean

  /**  */
  paperApplication?: boolean

  /**  */
  referralOpportunity?: boolean

  /**  */
  assets: AssetCreate[]

  /**  */
  accessibility?: string

  /**  */
  amenities?: string

  /**  */
  buildingTotalUnits?: number

  /**  */
  developer?: string

  /**  */
  householdSizeMax?: number

  /**  */
  householdSizeMin?: number

  /**  */
  neighborhood?: string

  /**  */
  petPolicy?: string

  /**  */
  smokingPolicy?: string

  /**  */
  unitsAvailable?: number

  /**  */
  unitAmenities?: string

  /**  */
  servicesOffered?: string

  /**  */
  yearBuilt?: number

  /**  */
  applicationDueDate?: Date

  /**  */
  applicationOpenDate?: Date

  /**  */
  applicationFee?: string

  /**  */
  applicationOrganization?: string

  /**  */
  applicationPickUpAddressOfficeHours?: string

  /**  */
  applicationDropOffAddressOfficeHours?: string

  /**  */
  buildingSelectionCriteria?: string

  /**  */
  costsNotIncluded?: string

  /**  */
  creditHistory?: string

  /**  */
  criminalBackground?: string

  /**  */
  depositMin?: string

  /**  */
  depositMax?: string

  /**  */
  depositHelperText?: string

  /**  */
  disableUnitsAccordion?: boolean

  /**  */
  leasingAgentEmail?: string

  /**  */
  leasingAgentName?: string

  /**  */
  leasingAgentOfficeHours?: string

  /**  */
  leasingAgentPhone?: string

  /**  */
  leasingAgentTitle?: string

  /**  */
  name: string

  /**  */
  postmarkedApplicationsReceivedByDate?: Date

  /**  */
  programRules?: string

  /**  */
  rentalAssistance?: string

  /**  */
  rentalHistory?: string

  /**  */
  requiredDocuments?: string

  /**  */
  specialNotes?: string

  /**  */
  waitlistCurrentSize?: number

  /**  */
  waitlistMaxSize?: number

  /**  */
  whatToExpect?: string

  /**  */
  applicationConfig?: object

  /**  */
  displayWaitlistSize: boolean

  /**  */
  reservedCommunityDescription?: string

  /**  */
  reservedCommunityMinAge?: number

  /**  */
  resultLink?: string

  /**  */
  isWaitlistOpen?: boolean

  /**  */
  waitlistOpenSpots?: number

  /**  */
  customMapPin?: boolean

  /**  */
  lastApplicationUpdateAt?: Date

  /**  */
  countyCode?: string

  /**  */
  features?: ListingFeatures

  /**  */
  utilities?: ListingUtilities
}

export interface MultiselectQuestionsFilterParams {
  /**  */
  $comparison: EnumMultiselectQuestionsFilterParamsComparison

  /**  */
  jurisdiction?: string

  /**  */
  applicationSection?: string
}

export interface MultiselectQuestionCreate {
  /**  */
  links?: MultiselectLink[]

  /**  */
  options?: MultiselectOption[]

  /**  */
  hideFromListing?: boolean

  /**  */
  applicationSection: ApplicationSection

  /**  */
  text: string

  /**  */
  subText?: string

  /**  */
  description?: string

  /**  */
  optOutText?: string

  /**  */
  jurisdictions?: IdName[]
}

export interface MultiselectQuestionUpdate {
  /**  */
  links?: MultiselectLink[]

  /**  */
  options?: MultiselectOption[]

  /**  */
  hideFromListing?: boolean

  /**  */
  applicationSection: ApplicationSection

  /**  */
  id: string

  /**  */
  text: string

  /**  */
  subText?: string

  /**  */
  description?: string

  /**  */
  optOutText?: string

  /**  */
  jurisdictions?: IdName[]
}

export interface ReservedCommunityTypeCreate {
  /**  */
  jurisdiction: Id

  /**  */
  name: string

  /**  */
  description?: string
}

export interface ReservedCommunityTypeUpdate {
  /**  */
  jurisdiction: Id

  /**  */
  name: string

  /**  */
  description?: string

  /**  */
  id: string
}

export interface Translation {
  /**  */
  language: Language

  /**  */
  jurisdiction: Id

  /**  */
  id: string

  /**  */
  createdAt: Date

  /**  */
  updatedAt: Date

  /**  */
  translations: object
}

export interface TranslationCreate {
  /**  */
  language: Language

  /**  */
  translations: object

  /**  */
  jurisdiction: Id
}

export interface TranslationUpdate {
  /**  */
  language: Language

  /**  */
  id?: string

  /**  */
  translations: object

  /**  */
  jurisdiction: Id
}

export interface UnitTypeCreate {
  /**  */
  name: string

  /**  */
  numBedrooms: number
}

export interface UnitTypeUpdate {
  /**  */
  name: string

  /**  */
  numBedrooms: number

  /**  */
  id: string
}

export interface UnitRentTypeCreate {
  /**  */
  name: string
}

export interface UnitRentTypeUpdate {
  /**  */
  name: string

  /**  */
  id: string
}

export interface UnitAccessibilityPriorityTypeCreate {
  /**  */
  name: string
}

export interface UnitAccessibilityPriorityTypeUpdate {
  /**  */
  name: string

  /**  */
  id: string
}

export enum IncomePeriod {
  "perMonth" = "perMonth",
  "perYear" = "perYear",
}

export enum ApplicationStatus {
  "draft" = "draft",
  "submitted" = "submitted",
  "removed" = "removed",
}

export enum Language {
  "en" = "en",
  "es" = "es",
  "vi" = "vi",
  "zh" = "zh",
  "tl" = "tl",
}

export enum ApplicationSubmissionType {
  "paper" = "paper",
  "electronical" = "electronical",
}

export enum ApplicationReviewStatus {
  "pending" = "pending",
  "pendingAndValid" = "pendingAndValid",
  "valid" = "valid",
  "duplicate" = "duplicate",
}
export type AllExtraDataTypes = BooleanInput | TextInput | AddressInput
export enum EnumApplicationFlaggedSetRule {
  "Name and DOB" = "Name and DOB",
  "Email" = "Email",
}
export enum EnumApplicationFlaggedSetStatus {
  "flagged" = "flagged",
  "pending" = "pending",
  "resolved" = "resolved",
}
export enum EnumApplicationFlaggedSetResolveStatus {
  "flagged" = "flagged",
  "pending" = "pending",
  "resolved" = "resolved",
}
export enum ApplicationMethodType {
  "Internal" = "Internal",
  "FileDownload" = "FileDownload",
  "ExternalLink" = "ExternalLink",
  "PaperPickup" = "PaperPickup",
  "POBox" = "POBox",
  "LeasingAgent" = "LeasingAgent",
  "Referral" = "Referral",
}
export type CombinedFileTypes = AssetUpdate
export enum InputType {
  "boolean" = "boolean",
  "text" = "text",
  "address" = "address",
  "hhMemberSelect" = "hhMemberSelect",
}
export enum EnumApplicationsApiExtraModelOrderBy {
  "firstName" = "firstName",
  "lastName" = "lastName",
  "submissionDate" = "submissionDate",
  "createdAt" = "createdAt",
}
export enum EnumApplicationsApiExtraModelOrder {
  "ASC" = "ASC",
  "DESC" = "DESC",
}
export enum EnumUserErrorExtraModelUserErrorMessages {
  "accountConfirmed" = "accountConfirmed",
  "accountNotConfirmed" = "accountNotConfirmed",
  "errorSaving" = "errorSaving",
  "emailNotFound" = "emailNotFound",
  "tokenExpired" = "tokenExpired",
  "tokenMissing" = "tokenMissing",
  "emailInUse" = "emailInUse",
  "passwordOutdated" = "passwordOutdated",
}
export enum EnumLoginMfaType {
  "sms" = "sms",
  "email" = "email",
}
export enum EnumRequestMfaCodeMfaType {
  "sms" = "sms",
  "email" = "email",
}
export enum EnumJurisdictionLanguages {
  "en" = "en",
  "es" = "es",
  "vi" = "vi",
  "zh" = "zh",
  "tl" = "tl",
}
export type CombinedRolesTypes = UserRoles
export enum EnumUserFilterParamsComparison {
  "=" = "=",
  "<>" = "<>",
  "IN" = "IN",
  ">=" = ">=",
  "NA" = "NA",
}
export enum EnumJurisdictionCreateLanguages {
  "en" = "en",
  "es" = "es",
  "vi" = "vi",
  "zh" = "zh",
  "tl" = "tl",
}
export enum EnumJurisdictionUpdateLanguages {
  "en" = "en",
  "es" = "es",
  "vi" = "vi",
  "zh" = "zh",
  "tl" = "tl",
}
export enum EnumListingFilterParamsComparison {
  "=" = "=",
  "<>" = "<>",
  "IN" = "IN",
  ">=" = ">=",
  "NA" = "NA",
}
export enum EnumListingFilterParamsStatus {
  "active" = "active",
  "pending" = "pending",
  "closed" = "closed",
}
export enum OrderByFieldsEnum {
  "mostRecentlyUpdated" = "mostRecentlyUpdated",
  "applicationDates" = "applicationDates",
  "mostRecentlyClosed" = "mostRecentlyClosed",
  "mostRecentlyPublished" = "mostRecentlyPublished",
  "name" = "name",
  "waitlistOpen" = "waitlistOpen",
  "status" = "status",
  "unitsAvailable" = "unitsAvailable",
  "marketingType" = "marketingType",
}

export enum OrderParam {
  "ASC" = "ASC",
  "DESC" = "DESC",
}

export enum ListingApplicationAddressType {
  "leasingAgent" = "leasingAgent",
}

export enum ListingStatus {
  "active" = "active",
  "pending" = "pending",
  "closed" = "closed",
}

export enum ListingReviewOrder {
  "lottery" = "lottery",
  "firstComeFirstServe" = "firstComeFirstServe",
}

export enum ListingAvailability {
  "availableUnits" = "availableUnits",
  "openWaitlist" = "openWaitlist",
}

export enum ListingEventType {
  "openHouse" = "openHouse",
  "publicLottery" = "publicLottery",
  "lotteryResults" = "lotteryResults",
}

export enum ApplicationSection {
  "programs" = "programs",
  "preferences" = "preferences",
}
export type CombinedPriorityTypeTypes = UnitAccessibilityPriorityType
export type CombinedApplicationPickUpAddressTypes = AddressUpdate
export type CombinedApplicationDropOffAddressTypes = AddressUpdate
export type CombinedApplicationMailingAddressTypes = AddressUpdate
export type CombinedBuildingSelectionCriteriaFileTypes = AssetUpdate
export type CombinedLeasingAgentAddressTypes = AddressUpdate
export type CombinedResultTypes = AssetCreate
export type CombinedBuildingAddressTypes = AddressUpdate
export enum EnumMultiselectQuestionsFilterParamsComparison {
  "=" = "=",
  "<>" = "<>",
  "IN" = "IN",
  ">=" = ">=",
  "NA" = "NA",
}
