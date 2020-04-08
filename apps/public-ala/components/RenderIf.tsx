import { useRouter } from "next/router"

const RenderIf = (props: { language: string; children: JSX.Element }) => {
  const router = useRouter()

  if (props.language == "all") {
    return props.children
  } else if (props.language == router.query.language) {
    return props.children
  } else if (!router.query.language && props.language == "default") {
    return props.children
  } else {
    return null
  }
}

export default RenderIf
