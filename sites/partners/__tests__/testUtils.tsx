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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const mockTipTapEditor = () => {
  // Mocking issue: https://github.com/ueberdosis/tiptap/discussions/4008#discussioncomment-7623655
  function getBoundingClientRect(): DOMRect {
    const rec = {
      x: 0,
      y: 0,
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    }
    return { ...rec, toJSON: () => rec }
  }

  class FakeDOMRectList extends Array<DOMRect> implements DOMRectList {
    item(index: number): DOMRect | null {
      return this[index]
    }
  }

  document.elementFromPoint = (): null => null
  HTMLElement.prototype.getBoundingClientRect = getBoundingClientRect
  HTMLElement.prototype.getClientRects = (): DOMRectList => new FakeDOMRectList()
  Range.prototype.getBoundingClientRect = getBoundingClientRect
  Range.prototype.getClientRects = (): DOMRectList => new FakeDOMRectList()
}
