import React, { FC, ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react"
import { SWRConfig } from "swr"
import { AuthProvider, ConfigProvider } from "@bloom-housing/shared-helpers"

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <ConfigProvider apiUrl={"http://localhost:3100"}>
        <AuthProvider>{children}</AuthProvider>
      </ConfigProvider>
    </SWRConfig>
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
  useRouter.mockImplementation(() => ({
    pathname: "/",
    query: query ?? "",
    push: pushMock,
  }))

  return { useRouter, pushMock }
}
