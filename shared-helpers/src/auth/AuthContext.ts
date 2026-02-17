import { GenericRouter } from "@bloom-housing/ui-components"
import {
  createContext,
  createElement,
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
} from "react"
import qs from "qs"
import axiosStatic from "axios"
import { ConfigContext } from "./ConfigContext"
import { createAction, createReducer } from "typesafe-actions"
import {
  AmiChartsService,
  ApplicationFlaggedSetsService,
  ApplicationsService,
  AuthService,
  JurisdictionsService,
  ListingsService,
  MapLayersService,
  MfaType,
  MultiselectQuestionsService,
  RequestMfaCodeResponse,
  ReservedCommunityTypesService,
  UnitTypesService,
  User,
  UserService,
  serviceOptions,
  SuccessDTO,
  LotteryService,
  LanguagesEnum,
  FeatureFlagsService,
  PropertiesService,
  PublicUserCreate,
  AdvocateUserCreate,
  PartnerUserCreate,
} from "../types/backend-swagger"
import { getListingRedirectUrl } from "../utilities/getListingRedirectUrl"
import { useRouter } from "next/router"

type ContextProps = {
  amiChartsService: AmiChartsService
  applicationsService: ApplicationsService
  applicationFlaggedSetsService: ApplicationFlaggedSetsService
  listingsService: ListingsService
  propertiesService: PropertiesService
  jurisdictionsService: JurisdictionsService
  userService: UserService
  authService: AuthService
  multiselectQuestionsService: MultiselectQuestionsService
  unitTypesService: UnitTypesService
  featureFlagService: FeatureFlagsService
  reservedCommunityTypeService: ReservedCommunityTypesService
  mapLayersService: MapLayersService
  lotteryService: LotteryService
  loadProfile: (redirect?: string) => void
  login: (
    email: string,
    password: string,
    mfaCode?: string,
    mfaType?: MfaType,
    forPartners?: boolean,
    reCaptchaToken?: string
  ) => Promise<User | undefined>
  resetPassword: (
    token: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<User | undefined>
  signOut: () => Promise<void>
  confirmAccount: (token: string) => Promise<User | undefined>
  forgotPassword: (email: string, listingIdRedirect?: string) => Promise<boolean | undefined>
  createPublicUser: (
    user: PublicUserCreate,
    listingIdRedirect?: string
  ) => Promise<User | undefined>
  createAdvocateUser: (
    user: AdvocateUserCreate,
    listingIdRedirect?: string
  ) => Promise<User | undefined>
  createPartnerUser: (
    user: PartnerUserCreate,
    listingIdRedirect?: string
  ) => Promise<User | undefined>
  resendConfirmation: (email: string, listingIdRedirect?: string) => Promise<boolean | undefined>
  initialStateLoaded?: boolean
  loading?: boolean
  profile?: User
  requestMfaCode: (
    email: string,
    password: string,
    mfaType: MfaType,
    phoneNumber?: string
  ) => Promise<RequestMfaCodeResponse | undefined>
  requestSingleUseCode: (email: string) => Promise<SuccessDTO | undefined>
  loginViaSingleUseCode: (email: string, singleUseCode: string) => Promise<User | undefined>
  doJurisdictionsHaveFeatureFlagOn: (
    featureFlag: string,
    jurisdiction?: string,
    onlyIfAllJurisdictionsHaveItEnabled?: boolean
  ) => boolean
  getJurisdictionLanguages: (jurisdictionId: string) => LanguagesEnum[]
}

// Internal Provider State
type AuthState = {
  initialStateLoaded: boolean
  language?: string
  loading: boolean
  profile?: User
  refreshTimer?: number
}

const saveProfile = createAction("SAVE_PROFILE")<User | null>()
const startLoading = createAction("START_LOADING")()
const stopLoading = createAction("STOP_LOADING")()
const signOut = createAction("SIGN_OUT")()

const reducer = createReducer(
  {
    loading: false,
    initialStateLoaded: false,
    language: "en",
    accessToken: undefined,
  } as AuthState,
  {
    SAVE_PROFILE: (state, { payload: user }) => {
      return {
        ...state,
        profile: user,
        initialStateLoaded: true,
      }
    },
    START_LOADING: (state) => ({ ...state, loading: true }),
    END_LOADING: (state) => ({ ...state, loading: false }),
    SIGN_OUT: () => ({ loading: false, initialStateLoaded: true }),
  }
)

const axiosConfig = (router: GenericRouter) => {
  return axiosStatic.create({
    baseURL: "/api/adapter",
    withCredentials: true,
    headers: {
      language: router.locale,
      jurisdictionName: process.env.jurisdictionName,
      appUrl: window.location.origin,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params)
    },
  })
}

export const AuthContext = createContext<Partial<ContextProps>>({})
export const AuthProvider: FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  const { apiUrl } = useContext(ConfigContext)
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    initialStateLoaded: false,
    language: router.locale,
  })

  const userService = useMemo(() => new UserService(), [])
  const authService = new AuthService()

  useEffect(() => {
    serviceOptions.axios = axiosConfig(router)
  }, [router, apiUrl, router.locale])

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        document.cookie
          .split("; ")
          .some((cookie) => cookie.startsWith("access-token-available=True"))
      ) {
        authService
          .requestNewToken()
          .then(() => {
            // this auto sets the new cookies so we don't really have to do anything
            // this set up is to avoid some linting errors
          })
          .catch((e) => {
            console.error(e)
          })
      }
    }, 1000 * 60 * 59) // runs once every 59 minutes
    return () => clearInterval(interval)
  })

  const loadProfile = useCallback(
    async (redirect?: string) => {
      try {
        let profile = undefined
        if (
          document.cookie
            .split("; ")
            .some((cookie) => cookie.startsWith("access-token-available=True"))
        ) {
          // if we have an access token
          profile = await userService?.profile()
        } else {
          dispatch(saveProfile(null))
        }

        if (profile) {
          dispatch(saveProfile(profile))
        }
      } catch (_) {
        dispatch(saveProfile(null))
      } finally {
        dispatch(stopLoading())

        if (redirect) {
          await router.push(redirect)
        }
      }
    },
    [userService, router]
  )

  // Load our profile as soon as we have an access token available
  useEffect(() => {
    if (!state?.profile && !state?.loading && !state?.initialStateLoaded) {
      void loadProfile()
    }
  }, [state?.profile, apiUrl, userService, state?.loading, loadProfile, state?.initialStateLoaded])

  const contextValues: ContextProps = {
    amiChartsService: new AmiChartsService(),
    applicationsService: new ApplicationsService(),
    applicationFlaggedSetsService: new ApplicationFlaggedSetsService(),
    listingsService: new ListingsService(),
    propertiesService: new PropertiesService(),
    jurisdictionsService: new JurisdictionsService(),
    userService: new UserService(),
    authService: new AuthService(),
    multiselectQuestionsService: new MultiselectQuestionsService(),
    mapLayersService: new MapLayersService(),
    lotteryService: new LotteryService(),
    reservedCommunityTypeService: new ReservedCommunityTypesService(),
    unitTypesService: new UnitTypesService(),
    featureFlagService: new FeatureFlagsService(),
    loading: state?.loading,
    initialStateLoaded: state?.initialStateLoaded,
    profile: state?.profile,
    loadProfile,
    login: async (
      email,
      password,
      mfaCode: string | undefined = undefined,
      mfaType: MfaType | undefined = undefined,
      forPartners: boolean | undefined = undefined,
      reCaptchaToken: string | undefined = undefined
    ) => {
      dispatch(startLoading())
      try {
        const response = await authService?.login({
          body: { email, password, mfaCode, mfaType, reCaptchaToken },
        })
        if (response) {
          const profile = await userService?.profile()
          if (
            profile &&
            (!forPartners ||
              profile.userRoles?.isAdmin ||
              profile.userRoles?.isSupportAdmin ||
              profile.userRoles?.isJurisdictionalAdmin ||
              profile.userRoles?.isLimitedJurisdictionalAdmin ||
              profile.userRoles?.isPartner)
          ) {
            dispatch(saveProfile(profile))
            return profile
          } else {
            throw Error("User cannot log in")
          }
        }
        return undefined
      } finally {
        dispatch(stopLoading())
      }
    },
    loginViaSingleUseCode: async (email, singleUseCode) => {
      dispatch(startLoading())
      try {
        const response = await authService?.loginViaASingleUseCode({
          body: { email, singleUseCode },
        })
        if (response) {
          const profile = await userService?.profile()
          if (profile) {
            dispatch(saveProfile(profile))
            return profile
          }
        }
        return undefined
      } finally {
        dispatch(stopLoading())
      }
    },
    signOut: async () => {
      await authService.logout()
      dispatch(saveProfile(null))
      dispatch(signOut())
    },
    resetPassword: async (token, password, passwordConfirmation) => {
      dispatch(startLoading())
      try {
        const response = await authService?.updatePassword({
          body: {
            token,
            password,
            passwordConfirmation,
          },
        })
        if (response) {
          const profile = await userService?.profile()
          if (profile) {
            dispatch(saveProfile(profile))
            return profile
          }
        }
        return undefined
      } finally {
        dispatch(stopLoading())
      }
    },
    confirmAccount: async (token) => {
      dispatch(startLoading())
      try {
        serviceOptions.axios = axiosConfig(router)

        const response = await authService?.confirm({ body: { token } })
        if (response) {
          const profile = await userService?.profile()
          if (profile) {
            dispatch(saveProfile(profile))
            return profile
          }
        }
        return undefined
      } finally {
        dispatch(stopLoading())
      }
    },
    createPublicUser: async (user: PublicUserCreate, listingIdRedirect) => {
      dispatch(startLoading())
      const appUrl = getListingRedirectUrl(listingIdRedirect)
      try {
        const response = await userService?.createPublic({
          body: { ...user, appUrl },
        })
        return response
      } finally {
        dispatch(stopLoading())
      }
    },
    createPartnerUser: async (user: PartnerUserCreate, listingIdRedirect) => {
      dispatch(startLoading())
      const appUrl = getListingRedirectUrl(listingIdRedirect)
      try {
        const response = await userService?.createPartner({
          body: { ...user, appUrl },
        })
        return response
      } finally {
        dispatch(stopLoading())
      }
    },
    createAdvocateUser: async (user: AdvocateUserCreate, listingIdRedirect) => {
      dispatch(startLoading())
      const appUrl = getListingRedirectUrl(listingIdRedirect)
      try {
        const response = await userService?.createAdvocate({
          body: { ...user, appUrl },
        })
        return response
      } finally {
        dispatch(stopLoading())
      }
    },
    resendConfirmation: async (email: string, listingIdRedirect) => {
      dispatch(startLoading())
      const appUrl = getListingRedirectUrl(listingIdRedirect)
      try {
        const response = await userService?.resendConfirmation({
          body: { email, appUrl },
        })
        return response.success
      } finally {
        dispatch(stopLoading())
      }
    },
    forgotPassword: async (email, listingIdRedirect) => {
      dispatch(startLoading())
      try {
        const appUrl = getListingRedirectUrl(listingIdRedirect)

        const response = await userService?.forgotPassword({
          body: { email, appUrl },
        })
        return response.success
      } finally {
        dispatch(stopLoading())
      }
    },
    requestMfaCode: async (email, password, mfaType, phoneNumber) => {
      dispatch(startLoading())
      try {
        return await authService?.requestMfaCode({
          body: { email, password, mfaType, phoneNumber },
        })
      } finally {
        dispatch(stopLoading())
      }
    },
    requestSingleUseCode: async (email) => {
      dispatch(startLoading())
      try {
        return await userService?.requestSingleUseCode({
          body: { email },
        })
      } finally {
        dispatch(stopLoading())
      }
    },
    doJurisdictionsHaveFeatureFlagOn: (
      featureFlag: string,
      jurisdictionId?: string,
      onlyIfAllJurisdictionsHaveItEnabled?: boolean
    ) => {
      let jurisdictions = state?.profile?.jurisdictions || []
      if (jurisdictionId) {
        jurisdictions = jurisdictions?.filter((j) => j.id === jurisdictionId)
      }
      // Return true only if all jurisdictions have the flag turned on
      if (onlyIfAllJurisdictionsHaveItEnabled) {
        return jurisdictions.every(
          (j) => j.featureFlags?.find((flag) => flag.name === featureFlag)?.active || false
        )
      }
      // Otherwise return true if at least one jurisdiction has the flag turned on
      return jurisdictions.some(
        (j) => j.featureFlags?.find((flag) => flag.name === featureFlag)?.active || false
      )
    },
    getJurisdictionLanguages: (jurisdictionId: string) => {
      const jurisdictions = state?.profile?.jurisdictions || []
      return jurisdictions.find((j) => j.id === jurisdictionId)?.languages || []
    },
  }
  return createElement(AuthContext.Provider, { value: contextValues }, children)
}
