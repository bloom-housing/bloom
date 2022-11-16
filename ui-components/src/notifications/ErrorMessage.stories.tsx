import React from "react"
import { ErrorMessage } from "./ErrorMessage"

export default {
  title: "Notifications/Error Message",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => <ErrorMessage />
export const WithText = () => <ErrorMessage>Error message</ErrorMessage>
export const WithTextAndError = () => <ErrorMessage error={true}>Error message</ErrorMessage>
