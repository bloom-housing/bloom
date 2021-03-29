import { useContext, useEffect, useState } from "react"
import { ApiClientContext, UserContext } from "@bloom-housing/ui-components"
import { Application } from "@bloom-housing/backend-core/types"

export default () => {
  const { profile } = useContext(UserContext)
  const { applicationsService } = useContext(ApiClientContext)
  const [application, setApplication] = useState<Application>()

  useEffect(() => {
    void (async () => {
      const response = await applicationsService.list({
        userId: profile.id,
        order: "created_at",
        orderBy: "DESC",
        limit: 1,
      })

      setApplication(response.items[0])
    })()
  }, [applicationsService, profile])

  {
    application ? (
      <>
        <h1>Save time by using the details from your last application</h1>
        <p>
          We'll simply pre-fill your application with the following details, and you can make
          updates as you go.
        </p>
      </>
    ) : (
      <p>Loading…</p>
    )
  }
}
