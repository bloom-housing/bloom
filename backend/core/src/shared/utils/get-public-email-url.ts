/**
 * Creates a email URL object from passed url applies redirectUrl and listingId query params if they exist
 * If they do not exist, the value will be return the email url with just the necessary token
 */

export const getPublicEmailURL = (url: string, token: string, actionPath?: string): string => {
  const urlObj = new URL(url)

  const redirectUrl = urlObj.searchParams.get("redirectUrl")
  const listingId = urlObj.searchParams.get("listingId")

  let emailUrl = `${urlObj.origin}${urlObj.pathname}/${actionPath ? actionPath : ""}?token=${token}`

  if (!!redirectUrl && !!listingId) {
    emailUrl = emailUrl.concat(`&redirectUrl=${redirectUrl}&listingId=${listingId}`)
  }
  console.log(emailUrl)
  return emailUrl
}
