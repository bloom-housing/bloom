import React from "react"
import { ResendConfirmationModal } from "./ResendConfirmationModal"

export default {
  title: "Page Components - Sign In/Resend Confirmation Modal",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const Default = () => (
  <ResendConfirmationModal
    isOpen={true}
    initialEmailValue={""}
    onClose={() => {}}
    onSubmit={() => {}}
    loading={false}
  />
)
