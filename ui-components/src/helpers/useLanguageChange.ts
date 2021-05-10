import { useEffect, useMemo, useContext } from "react"
import { useRouter } from "next/router"
import { LanguageNavLang } from "../navigation/LanguageNav"
import { t } from "../helpers/translator"
import { OnClientSide, ConfigContext } from "@bloom-housing/ui-components"

export function useLanguageChange(language: LanguageNavLang) {
  const router = useRouter()
  const isClient = OnClientSide()
  const { setLanguage } = useContext(ConfigContext)

  const routePrefix = t("config.routePrefix")

  const pathname = isClient ? window.location.pathname : ""

  const activeLangInPath = useMemo(
    () =>
      language.list.filter((item) => {
        const pattern = new RegExp(`^/(${item.prefix})(/|$)`, "gm")

        return item.prefix !== "" && pattern.test(pathname)
      }),
    [language, pathname]
  )

  useEffect(() => {
    if (!activeLangInPath.length) {
      setLanguage(language.codes?.[0] || "en")
    } else {
      const lang = activeLangInPath[0].prefix == "" ? "en" : activeLangInPath[0].prefix
      setLanguage(lang)
    }
  }, [activeLangInPath, routePrefix, setLanguage, language])

  function change(prefix: string): void {
    if (!isClient) return

    let newPath = pathname

    if (activeLangInPath.length && prefix === "") {
      newPath = pathname.replace(
        `${activeLangInPath[0].prefix}${pathname.length > 3 ? `/` : ``}`,
        ``
      )
    } else if (!activeLangInPath.length && prefix !== "") {
      newPath = `/${prefix + pathname}`
    } else if (activeLangInPath.length) {
      newPath = newPath.replace(/^\/.*?(\/|$)/, `/${prefix}$1`)
    }

    void router.replace({
      pathname: newPath,
    })
  }

  return change
}
