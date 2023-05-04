import axios from "axios"

interface CloudinaryUploadProps {
  file: File
  onUploadProgress: (progress: number) => void
  cloudName: string
  uploadPreset: string
  tag?: string
  signature?: string
  apiKey?: string
  timestamp?: number
}

export const CloudinaryUpload = async ({
  file,
  onUploadProgress,
  cloudName,
  uploadPreset,
  signature,
  apiKey,
  timestamp,
  tag = "browser_upload",
}: CloudinaryUploadProps) => {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`
  const data = new FormData()
  data.append("upload_preset", uploadPreset)
  data.append("tags", tag)
  data.append("file", file)
  if (signature && timestamp && apiKey) {
    data.append("signature", signature)
    data.append("timestamp", `${timestamp}`)
    data.append("api_key", apiKey)
  }

  if (!cloudName || cloudName == "" || !uploadPreset || uploadPreset == "") {
    const err = "Please supply a cloud name and upload preset for Cloudinary"
    alert(err)
    throw err
  }

  const response = await axios.request({
    method: "post",
    url: url,
    data: data,
    onUploadProgress: (p) => {
      onUploadProgress(parseInt(((p.loaded / p.total) * 100).toFixed(0), 10))
    },
  })
  return response
}
