import React, { useState } from "react"
import "./Modal.scss"
import { Modal } from "./Modal"
import { Button } from "../actions/Button"
import { AppearanceBorderType, AppearanceStyleType } from "../global/AppearanceTypes"

export default {
  title: "Overlays/Modal",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

const noop = () => {
  // intentionally blank
}

export const BasicModal = () => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setOpenModal(!openModal)
        }}
      >
        Open Modal
      </Button>
      <div style={{ height: "1000px" }}></div>
      <div>…</div>
      <Modal
        open={openModal}
        title="Modal Title"
        ariaDescription="Modal description"
        onClose={() => setOpenModal(!openModal)}
        actions={[
          <Button onClick={() => setOpenModal(!openModal)} styleType={AppearanceStyleType.primary}>
            Submit
          </Button>,
          <Button
            onClick={() => setOpenModal(!openModal)}
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
          >
            Cancel
          </Button>,
        ]}
      >
        Modal Content
      </Modal>
    </>
  )
}

export const TransparentOverlayModal = () => (
  <Modal
    open={true}
    title="Modal Title"
    ariaDescription="Modal description"
    hideCloseIcon
    actions={[
      <Button onClick={noop} styleType={AppearanceStyleType.primary}>
        Submit
      </Button>,
      <Button
        onClick={noop}
        styleType={AppearanceStyleType.secondary}
        border={AppearanceBorderType.borderless}
      >
        Cancel
      </Button>,
    ]}
    backdrop={false}
  >
    Modal Content
  </Modal>
)

export const SuccessFailureModal = () => (
  <Modal
    open={true}
    title="Modal Title"
    ariaDescription="Modal description"
    onClose={noop}
    actions={[
      <Button onClick={noop} styleType={AppearanceStyleType.success}>
        Submit
      </Button>,
      <Button onClick={noop} styleType={AppearanceStyleType.alert}>
        Cancel
      </Button>,
    ]}
  >
    Modal Content
  </Modal>
)
