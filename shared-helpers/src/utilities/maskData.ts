// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const maskAxiosResponse = (response: any) => {
  const configData = response?.config?.data ? JSON.parse(response.config.data) : undefined
  const maskedResponse = !configData
    ? response
    : {
        ...response,
        config: { ...response.config, data: maskData(configData) },
      }

  return maskedResponse
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
