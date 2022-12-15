import React from "react"
import { NavigationHeader } from "./NavigationHeader"

export default {
  title: "Page Components/Navigation Header",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => <NavigationHeader title={"Title"} />

export const WithBreadcrumbs = () => (
  <NavigationHeader title={"Title"} breadcrumbs={<div>Breadcrumbs</div>} />
)

export const WithChildren = () => <NavigationHeader title={"Title"}>Children</NavigationHeader>

export const WithTabs = () => (
  <NavigationHeader
    title={"Title"}
    tabs={{ show: true, listingLabel: "Listing Label", applicationsLabel: "Applications Label" }}
  />
)

export const WithFlaggedTabs = () => (
  <NavigationHeader
    title={"Title"}
    tabs={{
      show: true,
      listingLabel: "Listing Label",
      applicationsLabel: "Applications Label",
      flagsQty: 10,
    }}
  />
)

export const WithAll = () => (
  <NavigationHeader
    title={"Title"}
    breadcrumbs={<div>Breadcrumbs</div>}
    tabs={{
      show: true,
      listingLabel: "Listing Label",
      applicationsLabel: "Applications Label",
      flagsQty: 10,
    }}
  >
    Children
  </NavigationHeader>
)
