export const isExternalLink = (href: string) => {
  return href.startsWith("http://") || href.startsWith("https://")
}
