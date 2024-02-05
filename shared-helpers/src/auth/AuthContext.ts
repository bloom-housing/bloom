import {
  ApplicationsService,
  ApplicationFlaggedSetsService,
  AuthService,
  ListingsService,
  User,
  UserBasic,
  UserCreate,
  UserService,
  UserProfileService,
  serviceOptions,
  Status,
  AmiChartsService,
  ReservedCommunityTypesService,
  UnitAccessibilityPriorityTypesService,
  UnitTypesService,
  MultiselectQuestionsService,
  JurisdictionsService,
  RequestMfaCodeResponse,
  EnumRequestMfaCodeMfaType,
  EnumLoginMfaType,
  MapLayersService,
} from "@bloom-housing/backend-core/types"
import { GenericRouter, NavigationContext } from "@bloom-housing/ui-components"
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
import { getListingRedirectUrl } from "../utilities/getListingRedirectUrl"

type ContextProps = {
  amiChartsService: AmiChartsService
  applicationsService: ApplicationsService
  applicationFlaggedSetsService: ApplicationFlaggedSetsService
  listingsService: ListingsService
  jurisdictionsService: JurisdictionsService
  userService: UserService
  userProfileService: UserProfileService
  authService: AuthService
  multiselectQuestionsService: MultiselectQuestionsService
  unitTypesService: UnitTypesService
  reservedCommunityTypeService: ReservedCommunityTypesService
  unitPriorityService: UnitAccessibilityPriorityTypesService
  mapLayersService: MapLayersService
  loadProfile: (redirect?: string) => void
  login: (
    email: string,
    password: string,
    mfaCode?: string,
    mfaType?: EnumLoginMfaType
  ) => Promise<User | undefined>
  resetPassword: (
    token: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<User | undefined>
  signOut: () => void
  confirmAccount: (token: string) => Promise<User | undefined>
  forgotPassword: (email: string, listingIdRedirect?: string) => Promise<string | undefined>
  createUser: (user: UserCreate, listingIdRedirect?: string) => Promise<UserBasic | undefined>
  resendConfirmation: (email: string, listingIdRedirect?: string) => Promise<Status | undefined>
  initialStateLoaded: boolean
  loading: boolean
  profile?: User
  requestMfaCode: (
    email: string,
    password: string,
    mfaType: EnumRequestMfaCodeMfaType,
    phoneNumber?: string
  ) => Promise<RequestMfaCodeResponse | undefined>
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
  const { router } = useContext(NavigationContext)
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
          profile = await userService?.userControllerProfile()
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
          router.push(redirect)
        }
      }
    },
    [userService, router]
  )

  // Load our profile as soon as we have an access token available
  useEffect(() => {
    if (!state.profile && !state.loading && !state.initialStateLoaded) {
      void loadProfile()
    }
  }, [state.profile, apiUrl, userService, state.loading, loadProfile, state.initialStateLoaded])

  const contextValues: ContextProps = {
    amiChartsService: new AmiChartsService(),
    applicationsService: new ApplicationsService(),
    applicationFlaggedSetsService: new ApplicationFlaggedSetsService(),
    listingsService: new ListingsService(),
    jurisdictionsService: new JurisdictionsService(),
    userService: new UserService(),
    userProfileService: new UserProfileService(),
    authService: new AuthService(),
    multiselectQuestionsService: new MultiselectQuestionsService(),
    mapLayersService: new MapLayersService(),
    reservedCommunityTypeService: new ReservedCommunityTypesService(),
    unitPriorityService: new UnitAccessibilityPriorityTypesService(),
    unitTypesService: new UnitTypesService(),
    loading: state.loading,
    initialStateLoaded: state.initialStateLoaded,
    profile: state.profile,
    loadProfile,
    login: async (
      email,
      password,
      mfaCode: string | undefined = undefined,
      mfaType: EnumLoginMfaType | undefined = undefined
    ) => {
      dispatch(startLoading())
      try {
        const response = await authService?.login({ body: { email, password, mfaCode, mfaType } })
        if (response) {
          const profile = await userService?.userControllerProfile()
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
        const response = await userService?.updatePassword({
          body: {
            token,
            password,
            passwordConfirmation,
          },
        })
        if (response) {
          const profile = await userService?.userControllerProfile()
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

        const response = await userService?.confirm({ body: { token } })
        if (response) {
          const profile = await userService?.userControllerProfile()
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
    createUser: async (user: UserCreate, listingIdRedirect) => {
      dispatch(startLoading())
      const appUrl = getListingRedirectUrl(listingIdRedirect)
      try {
        const response = await userService?.create({
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
        return response
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
        return response?.message
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
  }
  return createElement(AuthContext.Provider, { value: contextValues }, children)
}
