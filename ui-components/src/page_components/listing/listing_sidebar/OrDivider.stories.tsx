import * as React from "react"
import OrDivider from "./OrDivider"

export default {
  title: "Listing Sidebar/Or Divider",
  component: OrDivider,
}

export const Default = () => {
  return <OrDivider strings={{ orString: "Or" }} bgColor={"white"} />
}

export const NoBgColor = () => {
  return <OrDivider strings={{ orString: "Other String" }} bgColor={""} />
}
