import t from "./translator"

const lRoute = (routeString: string) => {
  let routePrefix = t("CONFIG.ROUTE_PREFIX")
  if (routePrefix == "CONFIG.ROUTE_PREFIX") {
    routePrefix = "" // no prefix needed for default routes
  } else {
    routePrefix = "/" + routePrefix
  }
  return `${routePrefix}${routeString}`
}

export default lRoute
