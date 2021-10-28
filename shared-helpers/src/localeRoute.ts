import { t } from "@bloom-housing/ui-components"

export const lRoute = (routeString: string) => {
  if (routeString.startsWith("http")) return routeString

  let routePrefix = t("config.routePrefix")
  if (routePrefix == "config.routePrefix" || routePrefix == "") {
    routePrefix = "" // no prefix needed for default routes
  } else {
    routePrefix = "/" + routePrefix
  }
  return `${routePrefix}${routeString}`
}
