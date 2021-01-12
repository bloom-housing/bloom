import { useRouter } from "next/router"
import { LangItem } from "../navigation/LanguageNav"

export function useLanguageChange(languages: LangItem[]) {
  const router = useRouter()

  function change(prefix: string): void {
    if (typeof window == "undefined") return

    const pathname = window.location.pathname

    let newPath = pathname

    const pathIncludesLang = languages.filter((item) => {
      const pattern = new RegExp(`^/(${item.prefix})(/|$)`, "gm")

      return item.prefix !== "" && pattern.test(pathname)
    })

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
