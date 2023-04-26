import { MinMax } from "../../types"
import { PaperApplication } from "../../src/paper-applications/entities/paper-application.entity"
import { isEmpty } from "../shared/utils/is-empty"

export const cloudinaryPdfFromId = (publicId: string): string => {
  if (isEmpty(publicId)) return ""
  const cloudName = process.env.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.pdf`
}

export const getPaperAppUrls = (paperApps: PaperApplication[]) => {
  if (isEmpty(paperApps)) return ""
  const urlArr = paperApps.map((paperApplication) =>
    cloudinaryPdfFromId(paperApplication.file?.fileId)
  )
  const formattedResults = urlArr.join(", ")
  return formattedResults
}

export const formatYesNo = (value: boolean | null): string => {
  if (value === null || typeof value == "undefined") return ""
  else if (value) return "Yes"
  else return "No"
}

export const formatStatus = {
  active: "Public",
  pending: "Draft",
}

export const formatBedroom = {
  oneBdrm: "1 BR",
  twoBdrm: "2 BR",
  threeBdrm: "3 BR",
  fourBdrm: "4 BR",
  fiveBdrm: "5 BR",
  studio: "Studio",
}

export const formatCurrency = (value: string): string => {
  return value ? `$${value}` : ""
}

export const convertToTitleCase = (value: string): string => {
  if (isEmpty(value)) return ""
  const spacedValue = value.replace(/([A-Z])/g, (match) => ` ${match}`)
  const result = spacedValue.charAt(0).toUpperCase() + spacedValue.slice(1)
  return result
}

export const formatRange = (
  min: string | number,
  max: string | number,
  prefix: string,
  postfix: string
): string => {
  if (isEmpty(min) && isEmpty(max)) return ""
  if (min == max || isEmpty(max)) return `${prefix}${min}${postfix}`
  if (isEmpty(min)) return `${prefix}${max}${postfix}`
  return `${prefix}${min}${postfix} - ${prefix}${max}${postfix}`
}

export function formatRentRange(rent: MinMax, percent: MinMax): string {
  let toReturn = ""
  if (rent) {
    toReturn += formatRange(rent.min, rent.max, "", "")
  }
  if (rent && percent) {
    toReturn += ", "
  }
  if (percent) {
    toReturn += formatRange(percent.min, percent.max, "", "%")
  }
  return toReturn
}
