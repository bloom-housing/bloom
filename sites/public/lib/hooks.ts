import { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import { isInternalLink } from "@bloom-housing/ui-components"
import { AppSubmissionContext } from "./AppSubmissionContext"

export const useRedirectToPrevPage = (defaultPath = "/") => {
  const router = useRouter()

  return (queryParams: Record<string, string> = {}) => {
    const redirectUrl =
      typeof router.query.redirectUrl === "string" && isInternalLink(router.query.redirectUrl)
        ? router.query.redirectUrl
        : defaultPath

    return router.push({ pathname: redirectUrl, query: queryParams })
  }
}

export const useFormConductor = (stepName: string) => {
  const context = useContext(AppSubmissionContext)
  const conductor = context.conductor

  conductor.stepTo(stepName)

  useEffect(() => {
    conductor.skipCurrentStepIfNeeded()
  }, [conductor])
  return context
}
