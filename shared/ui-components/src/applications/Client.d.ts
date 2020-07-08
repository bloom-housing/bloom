import {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from "openapi-client-axios"

declare namespace Components {
  namespace Schemas {
    export interface Application {
      id: string
      createdAt: string // date-time
      updatedAt: string // date-time
      user: User
      userId: string
      listing: Listing
      listingId: string
      application: {}
    }
    export interface ApplicationCreateDto {
      application: {}
      listingId: string
      userId: string
    }
    export interface ApplicationDto {
      id: string
      listingId: string
      userId: string
      application: {}
    }
    export interface ApplicationUpdateDto {
      application: {}
      id: string
      listingId: string
      userId: string
    }
    export interface Attachment {
      id: string
      label: string
      fileUrl: string
      type: "ApplicationDownload" | "ExternalApplication"
      listing: Listing
    }
    export interface CreateUserDto {
      email: string
      firstName: string
      middleName: string
      lastName: string
      dob: string // date-time
      password: string
    }
    export interface Listing {
      preferences: Preference[]
      units: Unit[]
      attachments: Attachment[]
      id: string
      acceptingApplicationsAtLeasingAgent: boolean
      acceptingApplicationsByPoBox: boolean
      acceptingOnlineApplications: boolean
      acceptsPostmarkedApplications: boolean
      accessibility: string
      amenities: string
      applicationDueDate: string
      applicationOpenDate?: string
      applicationFee: string
      applicationOrganization: string
      applicationAddress: {}
      blankPaperApplicationCanBePickedUp: boolean
      buildingAddress: {}
      buildingTotalUnits: number
      buildingSelectionCriteria: string
      costsNotIncluded: string
      creditHistory: string
      criminalBackground: string
      depositMin: string
      depositMax?: string
      developer: string
      disableUnitsAccordion?: boolean
      imageUrl?: string
      leasingAgentAddress: {}
      leasingAgentEmail: string
      leasingAgentName: string
      leasingAgentOfficeHours: string
      leasingAgentPhone: string
      leasingAgentTitle: string
      name: string
      neighborhood: string
      petPolicy: string
      postmarkedApplicationsReceivedByDate: string
      programRules?: string
      rentalHistory: string
      requiredDocuments: string
      smokingPolicy: string
      unitsAvailable: number
      unitAmenities: string
      waitlistCurrentSize: number
      waitlistMaxSize: number
      whatToExpect?: {}
      yearBuilt: number
      unitsSummarized?: {}
      urlSlug?: string
      applications: Application[]
    }
    export interface ListingsListResponse {
      status: "ok"
      listings: Listing[]
      amiCharts: {}
    }
    export interface LoginDto {
      email: string
      password: string
    }
    export interface LoginResponseDto {
      accessToken: string
    }
    export interface Preference {
      id: string
      ordinal: string
      title: string
      subtitle?: string
      description?: string
      links?: {}[]
      listing: Listing
    }
    export interface Unit {
      id: string
      amiPercentage: string
      annualIncomeMin: string
      monthlyIncomeMin: number
      floor: number
      annualIncomeMax: string
      maxOccupancy: number
      minOccupancy: number
      monthlyRent: number
      numBathrooms: number
      numBedrooms: number
      number: string
      priorityType: string
      reservedType: string
      sqFeet: number
      status: string
      unitType: string
      createdAt: string // date-time
      updatedAt: string // date-time
      amiChartId: number
      monthlyRentAsPercentOfIncome: number
      listing: Listing
    }
    export interface User {
      id: string
      passwordHash: string
      email: string
      firstName: string
      middleName?: string
      lastName: string
      dob: string // date-time
      createdAt: string // date-time
      updatedAt: string // date-time
      applications: Application[]
    }
  }
}
declare namespace Paths {
  namespace ApplicationsControllerList {
    namespace Parameters {
      export type ListingId = string
      export type UserId = string
    }
    export interface QueryParameters {
      userId?: Parameters.UserId
      listingId?: Parameters.ListingId
    }
    namespace Responses {
      export type $200 = Components.Schemas.Application[]
    }
  }
  namespace AuthControllerLogin {
    export type RequestBody = Components.Schemas.LoginDto
    namespace Responses {
      export type $201 = Components.Schemas.LoginResponseDto
    }
  }
  namespace AuthControllerRegister {
    export type RequestBody = Components.Schemas.CreateUserDto
  }
  namespace ListingsControllerGetAll {
    namespace Parameters {
      export type Jsonpath = string
    }
    export interface QueryParameters {
      jsonpath?: Parameters.Jsonpath
    }
    namespace Responses {
      export type $200 = Components.Schemas.ListingsListResponse
    }
  }
  namespace UserApplicationsControllerCreate {
    export type RequestBody = Components.Schemas.ApplicationCreateDto
    namespace Responses {
      export type $201 = Components.Schemas.ApplicationDto
    }
  }
  namespace UserApplicationsControllerDelete {
    namespace Parameters {
      export type ApplicationId = string
      export type UserId = string
    }
    export interface PathParameters {
      userId: Parameters.UserId
      applicationId: Parameters.ApplicationId
    }
  }
  namespace UserApplicationsControllerFindOne {
    namespace Parameters {
      export type ApplicationId = string
      export type UserId = string
    }
    export interface PathParameters {
      userId: Parameters.UserId
      applicationId: Parameters.ApplicationId
    }
    namespace Responses {
      export type $200 = Components.Schemas.ApplicationDto
    }
  }
  namespace UserApplicationsControllerList {
    namespace Parameters {
      export type UserId = string
    }
    export interface PathParameters {
      userId: Parameters.UserId
    }
    namespace Responses {
      export type $200 = Components.Schemas.ApplicationDto[]
    }
  }
  namespace UserApplicationsControllerUpdate {
    namespace Parameters {
      export type ApplicationId = string
      export type UserId = string
    }
    export interface PathParameters {
      userId: Parameters.UserId
      applicationId: Parameters.ApplicationId
    }
    export type RequestBody = Components.Schemas.ApplicationUpdateDto
    namespace Responses {
      export type $200 = Components.Schemas.ApplicationDto
    }
  }
  namespace UserControllerProfile {
    namespace Responses {
      export interface $200 {}
    }
  }
}

export interface OperationMethods {
  /**
   * UserController_profile
   */
  UserController_profile(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UserControllerProfile.Responses.$200>
  /**
   * UserApplicationsController_list
   */
  UserApplicationsController_list(
    parameters?: Parameters<Paths.UserApplicationsControllerList.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UserApplicationsControllerList.Responses.$200>
  /**
   * UserApplicationsController_create
   */
  UserApplicationsController_create(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.UserApplicationsControllerCreate.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UserApplicationsControllerCreate.Responses.$201>
  /**
   * UserApplicationsController_findOne
   */
  UserApplicationsController_findOne(
    parameters?: Parameters<Paths.UserApplicationsControllerFindOne.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UserApplicationsControllerFindOne.Responses.$200>
  /**
   * UserApplicationsController_update
   */
  UserApplicationsController_update(
    parameters?: Parameters<Paths.UserApplicationsControllerUpdate.PathParameters>,
    data?: Paths.UserApplicationsControllerUpdate.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UserApplicationsControllerUpdate.Responses.$200>
  /**
   * UserApplicationsController_delete
   */
  UserApplicationsController_delete(
    parameters?: Parameters<Paths.UserApplicationsControllerDelete.PathParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<any>
  /**
   * AuthController_login
   */
  AuthController_login(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.AuthControllerLogin.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AuthControllerLogin.Responses.$201>
  /**
   * AuthController_register
   */
  AuthController_register(
    parameters?: Parameters<UnknownParamsObject>,
    data?: Paths.AuthControllerRegister.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<any>
  /**
   * AuthController_token
   */
  AuthController_token(
    parameters?: Parameters<UnknownParamsObject>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<any>
  /**
   * ListingsController_getAll
   */
  ListingsController_getAll(
    parameters?: Parameters<Paths.ListingsControllerGetAll.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ListingsControllerGetAll.Responses.$200>
  /**
   * ApplicationsController_list
   */
  ApplicationsController_list(
    parameters?: Parameters<Paths.ApplicationsControllerList.QueryParameters>,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ApplicationsControllerList.Responses.$200>
}

export interface PathsDictionary {
  ["/user/profile"]: {
    /**
     * UserController_profile
     */
    get(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UserControllerProfile.Responses.$200>
  }
  ["/user/{userId}/applications"]: {
    /**
     * UserApplicationsController_list
     */
    get(
      parameters?: Parameters<Paths.UserApplicationsControllerList.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UserApplicationsControllerList.Responses.$200>
    /**
     * UserApplicationsController_create
     */
    post(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.UserApplicationsControllerCreate.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UserApplicationsControllerCreate.Responses.$201>
  }
  ["/user/{userId}/applications/{applicationId}"]: {
    /**
     * UserApplicationsController_findOne
     */
    get(
      parameters?: Parameters<Paths.UserApplicationsControllerFindOne.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UserApplicationsControllerFindOne.Responses.$200>
    /**
     * UserApplicationsController_update
     */
    put(
      parameters?: Parameters<Paths.UserApplicationsControllerUpdate.PathParameters>,
      data?: Paths.UserApplicationsControllerUpdate.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UserApplicationsControllerUpdate.Responses.$200>
    /**
     * UserApplicationsController_delete
     */
    delete(
      parameters?: Parameters<Paths.UserApplicationsControllerDelete.PathParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>
  }
  ["/auth/login"]: {
    /**
     * AuthController_login
     */
    post(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.AuthControllerLogin.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AuthControllerLogin.Responses.$201>
  }
  ["/auth/register"]: {
    /**
     * AuthController_register
     */
    post(
      parameters?: Parameters<UnknownParamsObject>,
      data?: Paths.AuthControllerRegister.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>
  }
  ["/auth/token"]: {
    /**
     * AuthController_token
     */
    post(
      parameters?: Parameters<UnknownParamsObject>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>
  }
  ["/"]: {
    /**
     * ListingsController_getAll
     */
    get(
      parameters?: Parameters<Paths.ListingsControllerGetAll.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ListingsControllerGetAll.Responses.$200>
  }
  ["/applications"]: {
    /**
     * ApplicationsController_list
     */
    get(
      parameters?: Parameters<Paths.ApplicationsControllerList.QueryParameters>,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ApplicationsControllerList.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
