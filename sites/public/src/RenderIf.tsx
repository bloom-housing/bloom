import { useRouter } from "next/router"

const RenderIf = (props: { language: string; children: JSX.Element }) => {
  const router = useRouter()

  if (
    props.language == "all" ||
    props.language == router.locale ||
    (router.locale == "en" && props.language == "default")
  ) {
    return props.children
  }
  return null
}

export default RenderIf
