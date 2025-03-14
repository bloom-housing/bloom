import React, { FC, ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react"
import {
  AuthProvider,
  ConfigProvider,
  blankApplication,
  MessageContext,
  MessageProvider,
} from "@bloom-housing/shared-helpers"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Toast } from "@bloom-housing/ui-seeds"
import {
  AppSubmissionContext,
  retrieveApplicationConfig,
} from "../src/lib/applications/AppSubmissionContext"
import ApplicationConductor from "../src/lib/applications/ApplicationConductor"

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  const conductor = new ApplicationConductor({}, {})
  const applicationConfig = retrieveApplicationConfig(conductor.listing)
  conductor.config = applicationConfig

  const ToastProvider = (props) => {
    const { toastMessagesRef } = React.useContext(MessageContext)
    return (
      <MessageProvider>
        {toastMessagesRef.current?.map((toastMessage) => (
          <Toast {...toastMessage.props} testId="toast-alert" key={toastMessage.timestamp}>
            {toastMessage.message}
          </Toast>
        ))}
        {props.children}
      </MessageProvider>
    )
  }

  return (
    <AppSubmissionContext.Provider
      value={{
        conductor: conductor,
        application: JSON.parse(JSON.stringify(blankApplication)),
        listing: {} as Listing,
        syncApplication: () => {
          return
        },
        syncListing: () => {
          return
        },
      }}
    >
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </ConfigProvider>
    </AppSubmissionContext.Provider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
// eslint-disable-next-line import/export
export * from "@testing-library/react"

// override render method
// eslint-disable-next-line import/export
export { customRender as render }

export const mockNextRouter = (query?: any) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const useRouter = jest.spyOn(require("next/router"), "useRouter")
  const pushMock = jest.fn()
  const backMock = jest.fn()
  useRouter.mockImplementation(() => ({
    pathname: "/",
    query: query ?? "",
    push: pushMock,
    back: backMock,
  }))

  return { useRouter, pushMock, backMock }
}
