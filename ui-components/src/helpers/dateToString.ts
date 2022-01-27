import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

export const dateToString = (submissionDate: Date) => {
  if (!submissionDate) return null
  const formattedSubmissionDate = dayjs(new Date(submissionDate)).utc()
  const month = formattedSubmissionDate.format("MMMM")
  const day = formattedSubmissionDate.format("DD")
  const year = formattedSubmissionDate.format("YYYY")

  return `${month} ${day}, ${year}`
}
