import axios from "axios"

type FileUploadResult = {
  id: string
  url: string
}

// This is just under the partner site for now but could easily be moved to
// shared-helpers if needed for public site
export class AssetUploader {
  uploadEndpoint: string

  // AssetUploader(process.env.backendApiBase) => direct to backend
  // AssetUploader("", "/api/adapter/upload") => pass through local adapter
  constructor(backendApiBase, uploadEndpoint = "/assets/upload") {
    this.uploadEndpoint = `${backendApiBase}${uploadEndpoint}`
  }

  async uploadAsset(
    file: File,
    label: string,
    onUploadProgress: (progress: number) => void
    //headers: Record<string, string>
  ): Promise<FileUploadResult> {
    // init progress bar
    onUploadProgress(1)

    const uploadUrl = this.uploadEndpoint

    // add file and label
    const data = new FormData()
    data.append("file", file)
    data.append("label", label)

    // AuthContext
    const headers = {
      jurisdictionname: "Bay Area", //process.env.jurisdictionName
      language: "en", // router.locale
      appUrl: "", // window.location.origin
    }

    // send request to backend
    const response = await axios.request<FileUploadResult>({
      method: "POST",
      url: uploadUrl,
      data: data,
      headers: headers,
      onUploadProgress: (p) => {
        onUploadProgress(parseInt(((p.loaded / p.total) * 100).toFixed(0), 10))
      },
    })

    // show complete
    onUploadProgress(100)
    return response.data
  }

  async uploadAssetAndSetData(
    file: File,
    label: string,
    setProgressValue: (value: React.SetStateAction<number>) => void,
    setAssetData: (data: { id: string; url: string }) => void
  ) {
    const setProgressValueCallback = (value: number) => {
      setProgressValue(value)
    }

    const data = await this.uploadAsset(file, label, setProgressValueCallback)

    setAssetData({
      id: data.url,
      url: data.url,
    })
  }
}

// Shortcut for default implementations
export async function uploadAssetAndSetData(
  file: File,
  label: string,
  setProgressValue: (value: React.SetStateAction<number>) => void,
  setAssetData: (data: { id: string; url: string }) => void
) {
  // Default to /api/adapter/upload on the local service
  const uploader = new AssetUploader("", "/api/adapter/upload")
  return await uploader.uploadAssetAndSetData(file, label, setProgressValue, setAssetData)
}
