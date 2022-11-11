import { useRouter } from "next/router"

const RenderIf = (props: { language: string; children: JSX.Element }) => {
  const router = useRouter()

  if (props.language == "all") {
    return props.children
  } else if (props.language == router.locale) {
    return props.children
  } else if (router.locale == "en" && props.language == "default") {
    return props.children
  } else if (props.language.includes(",") && props.language.split(",").includes(router.locale)) {
    return props.children
  } else {
    return null
  }
}

export default RenderIf
