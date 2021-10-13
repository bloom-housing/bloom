import * as React from "react"

import { Heading } from "./Heading"

export default {
  title: "Headers/Heading",
}
export const base = () => <Heading>Test Header</Heading>

export const underlined = () => <Heading underline>Test Header</Heading>

export const underlinedWithH6 = () => <Heading priority={6}>Test Header</Heading>
