import { useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import { LangItem } from "../navigation/LanguageNav"
import { t } from "../helpers/translator"
import { OnClientSide } from "@bloom-housing/ui-components"

export function useLanguageChange(languages: LangItem[]) {
  const router = useRouter()
  const isClient = OnClientSide()

  const routePrefix = t("config.routePrefix")

  const pathname = isClient ? window.location.pathname : ""

  const pathIncludesLang = useMemo(
    () =>
      languages.filter((item) => {
        const pattern = new RegExp(`^/(${item.prefix})(/|$)`, "gm")

        return item.prefix !== "" && pattern.test(pathname)
      }),
    [languages, pathname]
  )

  useEffect(() => {
    if (!pathIncludesLang.length) {
      console.log("en")
    } else {
      console.log(pathIncludesLang[0].prefix)
    }
  }, [pathIncludesLang, routePrefix])

  function change(prefix: string): void {
    if (!isClient) return

    let newPath = pathname

    if (pathIncludesLang.length && prefix === "") {
      newPath = pathname.replace(
        `${pathIncludesLang[0].prefix}${pathname.length > 3 ? `/` : ``}`,
        ``
      )
    } else if (!pathIncludesLang.length && prefix !== "") {
      newPath = `/${prefix + pathname}`
    } else if (pathIncludesLang.length) {
      newPath = newPath.replace(/^\/.*?(\/|$)/, `/${prefix}$1`)
    }

    void router.replace({
      pathname: newPath,
    })
  }

  return change
}
