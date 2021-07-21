import * as React from "react"
import { withKnobs, text } from "@storybook/addon-knobs"
import { CloudinaryUpload } from "./CloudinaryUpload"
import { Dropzone } from "./Dropzone"

export default {
  title: "Forms/Dropzone",
  decorators: [(storyFn: any) => <div style={{ padding: "1rem" }}>{storyFn()}</div>, withKnobs],
}

export const defaultDropzone = () => {
  const [progressValue, setProgressValue] = React.useState(0)
  const [cloudinaryImage, setCloudinaryImage] = React.useState("")
  const cloudName = text("Cloudinary Cloud", "")
  const uploadPreset = text("Upload Preset", "")

  const exampleUploader = (file: File) => {
    CloudinaryUpload({
      file: file,
      onUploadProgress: (progress) => {
        setProgressValue(progress)
      },
      cloudName,
      uploadPreset,
    }).then((response) => {
      setProgressValue(100)
      const imgUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_400,c_limit,q_65/${response.data.public_id}.jpg`
      setCloudinaryImage(imgUrl)
    })
  }

  return (
    <>
      <Dropzone
        id="test-uploading"
        label="Upload File"
        helptext="Select JPEG or PNG files"
        uploader={exampleUploader}
        accept="image/*"
        progress={progressValue}
      />
      {progressValue == 0 && (
        <p className="mt-16">(Provide Cloudinary credentials via the Knobs below.)</p>
      )}
      <img src={cloudinaryImage} style={{ width: "200px" }} />
    </>
  )
}
