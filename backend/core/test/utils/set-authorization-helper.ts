export const setAuthorization = (accessToken: string): ["Cookie", string] => {
  return ["Cookie", accessToken]
}
