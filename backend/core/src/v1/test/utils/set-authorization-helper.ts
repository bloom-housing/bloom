export const setAuthorization = (accessToken: string): [string, string] => {
  return ["Authorization", `Bearer ${accessToken}`]
}
