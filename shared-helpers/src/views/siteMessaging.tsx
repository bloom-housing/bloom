export const setSiteMessage = (message: string, type: string) => {
  sessionStorage.setItem(`alert_message_${type}`, message)
}

export const getSiteMessage = (type: string): string | null => {
  const storedMessage = sessionStorage.getItem(`alert_message_${type}`)
  if (storedMessage) {
    sessionStorage.removeItem(`alert_message_${type}`)
    return storedMessage
  }
  return null
}

export const clearSiteMessaging = (type: string): void => {
  sessionStorage.removeItem(`alert_message_${type}`)
}
