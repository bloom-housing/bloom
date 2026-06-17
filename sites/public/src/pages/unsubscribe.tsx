import React, { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import { t } from "@bloom-housing/ui-components"
import { AuthContext, BloomCard } from "@bloom-housing/shared-helpers"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { Button, LoadingState } from "@bloom-housing/ui-seeds"
import FormsLayout from "../layouts/forms"

type UnsubscribeStatus = "loading" | "success" | "error"

const Unsubscribe = () => {
  const router = useRouter()
  const { userService, initialStateLoaded } = useContext(AuthContext)
  const [status, setStatus] = useState<UnsubscribeStatus>("loading")

  useEffect(() => {
    if (!initialStateLoaded) return

    const email = router.query?.email as string
    const sig = router.query?.sig as string

    if (!email || !sig) {
      setStatus("error")
      return
    }

    void userService
      .unsubscribeFromAll({ body: { email, sig } })
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"))
  }, [initialStateLoaded, router.query, userService])

  return (
    <FormsLayout pageTitle={t("t.unsubscribe")} metaDescription={""}>
      <LoadingState loading={status === "loading"}>
        <BloomCard
          title={
            status === "success"
              ? t("account.unsubscribe.successTitle")
              : status === "error"
              ? t("account.unsubscribe.errorTitle")
              : t("t.unsubscribe")
          }
          iconSymbol={"envelope"}
          iconClass={"card-icon"}
          headingClass={"seeds-large-heading"}
        >
          <CardSection>
            {status === "success" && (
              <>
                <p className={"seeds-m-be-6"}>{t("account.unsubscribe.successMessage")}</p>
                <Button onClick={() => void router.push("/account/notifications")}>
                  {t("account.unsubscribe.manageSubscriptions")}
                </Button>
              </>
            )}
            {status === "error" && <p>{t("account.unsubscribe.errorMessage")}</p>}
          </CardSection>
        </BloomCard>
      </LoadingState>
    </FormsLayout>
  )
}

export default Unsubscribe
