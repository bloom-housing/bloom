import React from "react"

import { Breadcrumbs, BreadcrumbLink } from "./Breadcrumbs"

export default {
  title: "Navigation/Breadcrumbs",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <Breadcrumbs>
    <BreadcrumbLink href="#">One</BreadcrumbLink>
    <BreadcrumbLink href="#">
      Two
    </BreadcrumbLink>
    <BreadcrumbLink current={true} href="#">
      Three
    </BreadcrumbLink>
  </Breadcrumbs>
)
