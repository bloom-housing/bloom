export const getListingRedirectUrl = (
  listingIdRedirect: string | undefined,
  path: string = window.location.origin
) => {
  return process.env.showMandatedAccounts && listingIdRedirect
    ? `${path}?redirectUrl=/applications/start/choose-language&listingId=${listingIdRedirect}`
    : path
}
