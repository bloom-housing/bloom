import { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import { AppSubmissionContext } from "./AppSubmissionContext"

export const useRedirectToPrevPage = (defaultPath = "/") => {
  const router = useRouter()

  return (queryParams: Record<string, any> = {}) => {
    const redirectUrl = router.query.redirectUrl

    return router.push({
      pathname: redirectUrl && typeof redirectUrl === "string" ? redirectUrl : defaultPath,
      query: queryParams,
    })
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
