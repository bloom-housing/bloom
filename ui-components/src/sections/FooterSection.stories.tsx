import React from "react"
import { FooterSection } from "./FooterSection"

export default {
  title: "Sections/Footer Section",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => <FooterSection className={"border"}>Children</FooterSection>
