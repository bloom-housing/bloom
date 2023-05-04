import * as React from "react"
import { withKnobs } from "@storybook/addon-knobs"
import { Dropzone } from "./Dropzone"

export default {
  title: "Forms/Dropzone",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>, withKnobs],
}

export const defaultDropzone = () => {
  return (
    <>
      <Dropzone
        id="test-uploading"
        label="Upload File"
        helptext="Select JPEG or PNG files"
        uploader={() => {
          alert("Uploader function called")
        }}
        accept="image/*"
        progress={0}
      />
    </>
  )
}

export const inProgress = () => {
  return (
    <>
      <Dropzone
        id="test-uploading"
        label="Upload File"
        helptext="Select JPEG or PNG files"
        uploader={() => {}}
        accept="image/*"
        progress={50}
      />
    </>
  )
}
