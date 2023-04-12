export interface FileServiceInterface {
  putFile(key: string, file: File, setProgressValue: (value: number) => void): Promise<string>
  getDownloadUrlForPhoto(id: string, size?: number): string
  getDownloadUrlForPdf(id: string): string
}
