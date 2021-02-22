import React from "react"

import { Breadcrumbs, BreadcrumbLink } from "./Breadcrumbs"

export default {
  title: "Navigation/Breadcrumbs",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <Breadcrumbs>
    <BreadcrumbLink href="/One">One</BreadcrumbLink>
    <BreadcrumbLink href="/Two">Two</BreadcrumbLink>
    <BreadcrumbLink current={true} href="/Three">
      Three
    </BreadcrumbLink>
  </Breadcrumbs>
)
