import axios from "axios"

export const CloudinaryUpload = async ({ file, onUploadProgress, cloudName, uploadPreset, tag = "browser_upload" }) => {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`
  const data = new FormData()
  data.append("upload_preset", uploadPreset)
  data.append("tags", tag)
  data.append("file", file)

  if (cloudName == "" || uploadPreset == "") {
    return alert("Please supply a cloud name and upload preset for Cloudinary")
  }

  const response = await axios
    .request({
      method: "post",
      url: url,
      data: data,
      onUploadProgress: (p) => {
        //        console.info(p)
        onUploadProgress(parseInt(((p.loaded / p.total) * 100).toFixed(0), 10))
      },
    })
  return response
}
