import React from "react"
import "./Modal.scss"
import Modal from "./Modal"
import SVG from "react-inlinesvg"

export default {
  title: "Modal/Modal",
  decorators: [
    (storyFn: any) => (
      <div style={{ padding: "1rem" }}>
        {storyFn()}
        <SVG src="/images/icons.svg" />
      </div>
    ),
  ],
}

const noop = () => {
  // intentionally blank
}

export const BasicModal = () => (
  <Modal
    open={true}
    title="Modal Title"
    onClose={noop}
    actions={[
      { label: "Cancel", onClick: noop, type: "cancel" },
      { label: "Submit", onClick: noop, type: "primary" },
    ]}
  >
    Modal Content
  </Modal>
)

export const FullScreenModal = () => (
  <Modal
    open={true}
    title="Modal Title"
    onClose={noop}
    actions={[
      { label: "Cancel", onClick: noop, type: "cancel" },
      { label: "Submit", onClick: noop, type: "primary" },
    ]}
    fullScreen
  >
    Modal Content
  </Modal>
)

export const SuccessFailureModal = () => (
  <Modal
    open={true}
    title="Modal Title"
    onClose={noop}
    actions={[
      { label: "Cancel", onClick: noop, type: "failure" },
      { label: "Submit", onClick: noop, type: "success" },
    ]}
  >
    Modal Content
  </Modal>
)
