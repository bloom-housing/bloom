import * as React from "react"
import { Heading } from "./Heading"

export default {
  title: "Headers/Heading",
}
export const base1 = () => <Heading>Test Header</Heading>
export const base2 = () => <Heading priority={2}>Test Header</Heading>
export const base3 = () => <Heading priority={3}>Test Header</Heading>
export const base4 = () => <Heading priority={4}>Test Header</Heading>
export const base5 = () => <Heading priority={5}>Test Header</Heading>
export const base6 = () => <Heading priority={6}>Test Header</Heading>
export const cardHeader = () => <Heading style={"cardHeader"}>Card Header</Heading>
export const cardSubheader = () => <Heading style={"cardSubheader"}>Card Subheader</Heading>
export const tableHeader = () => <Heading style={"tableHeader"}>Table Header</Heading>
export const tableSubheader = () => <Heading style={"tableSubheader"}>Table Subheader</Heading>
export const sidebarHeader = () => <Heading style={"sidebarHeader"}>Sidebar Header</Heading>
export const categoryHeader = () => <Heading style={"categoryHeader"}>Category Header</Heading>
export const sidebarSubHeader = () => (
  <Heading style={"sidebarSubHeader"}>Sidebar Subheader</Heading>
)

export const customPriority = () => (
  <Heading style={"cardSubheader"} priority={6}>
    Custom Priority
  </Heading>
)
