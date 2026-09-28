// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const maskAxiosResponse = (response: any) => {
  const config = response?.config
  if (!config) return response

  const configData = config.data ? JSON.parse(config.data) : undefined

  return {
    ...response,
    config: {
      ...config,
      ...(configData ? { data: maskData(configData) } : {}),
      ...(config.headers ? { headers: maskHeaders(config.headers) } : {}),
    },
  }
}

// The api passkey authenticates every request the sites make, and it must not reach a log.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const maskHeaders = (headers: any) => {
  if (!headers?.passkey) return headers
  return { ...headers, passkey: "*******" }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const maskData = (data: any) => {
  const maskedData = { ...data }
  if (data.password) {
    maskedData.password = "*******"
  }
  if (data.email) {
    const emailChunks = data.email.split("@")
    maskedData.email = emailChunks.length === 2 ? `****@${emailChunks[1]}` : data.email
  }
  return maskedData
}
