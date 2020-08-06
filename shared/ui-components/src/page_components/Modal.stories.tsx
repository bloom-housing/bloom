import React from "react"
import { withA11y } from "@storybook/addon-a11y"
import Modal from "./Modal"
//import Icon from "../atoms/Icon"

export default {
  title: "Prototypes/Modal",
  decorators: [withA11y, (storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>],
}

export const ModalNormal = () => (
  <Modal
    title="Header"
    content="Loreum ipsum"
    submitText="Submit"
    onSubmit={() => {
      //
    }}
    cancelText="Cancel"
    onCancel={() => {
      //
    }}
  ></Modal>
)

export const ModalWarning = () => (
  <Modal
    title="Header"
    content="Loreum ipsum"
    submitText="Submit"
    alert={true}
    onSubmit={() => {
      //
    }}
    cancelText="Cancel"
    onCancel={() => {
      //
    }}
  ></Modal>
)
