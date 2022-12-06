import React from "react"
import FormCard from "./FormCard"

export default {
  title: "Blocks/Form Card",
}

export const Default = () => <FormCard>Content</FormCard>

export const WithTitle = () => (
  <FormCard header={{ title: "Title", isVisible: true }}>Content</FormCard>
)

export const WithInvisibleTitle = () => (
  <FormCard header={{ title: "Title", isVisible: false }}>Content</FormCard>
)
