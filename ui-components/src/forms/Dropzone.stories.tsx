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

  const uploadTest = (file) => {
    CloudinaryUpload({
      file: file, onUploadProgress: (progress) => {
        setProgressValue(progress)
      }, cloudName, uploadPreset
    }).then(response => {
      console.info(response.data.public_id)
      const imgUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_400,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/${response.data.public_id}.jpg`
      setCloudinaryImage(imgUrl)
    })
  }

  return <>
    <Dropzone label="Upload File" uploader={uploadTest} />
    <progress value={progressValue} max="100" style={{ width: "250px" }}></progress>
    <img src={cloudinaryImage} />
  </>
}
