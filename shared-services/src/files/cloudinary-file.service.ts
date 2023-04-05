import { cloudinaryPdfFromId, cloudinaryUrlFromId } from "@bloom-housing/shared-helpers"
import { cloudinaryFileUploader } from "../../../sites/partners/src/lib/helpers"
import { FileServiceInterface } from "./file-service.interface"

export class CloudinaryFileService implements FileServiceInterface {
  async putFile(
    key: string,
    file: File,
    setProgressValue: (value: number) => void
  ): Promise<string> {
    const id = await cloudinaryFileUploader({ file, setProgressValue })
    return id
  }
  getDownloadUrlForPhoto(id: string, size = 400): string {
    return cloudinaryUrlFromId(id, size)
  }
  getDownloadUrlForPdf(id: string): string {
    return cloudinaryPdfFromId(id)
  }
}
