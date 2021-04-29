import moment from "moment"

export const dateToString = (submissionDate: Date) => {
  if (!submissionDate) return null
  const formattedSubmissionDate = moment(new Date(submissionDate)).utc()
  const month = formattedSubmissionDate.format("MMMM")
  const day = formattedSubmissionDate.format("DD")
  const year = formattedSubmissionDate.format("YYYY")

  return `${month} ${day}, ${year}`
}
