import React from "react"
import { FooterNav } from "./FooterNav"

export default {
  title: "Navigation/Footer Nav",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => <FooterNav copyright={"Copyright string"} />

export const WithLinks = () => (
  <FooterNav copyright={"Copyright string"}>
    <a href="/privacy">Privacy</a>
    <a href="/disclaimer">Disclaimer</a>
  </FooterNav>
)
