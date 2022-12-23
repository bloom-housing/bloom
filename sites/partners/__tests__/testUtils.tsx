import { AuthProvider, ConfigProvider } from "../shared"
import { render, RenderOptions } from "@testing-library/react"
import React, { FC, ReactElement } from "react"
import { SWRConfig } from "swr"

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
export * from "@testing-library/react"

// override render method
export { customRender as render }
