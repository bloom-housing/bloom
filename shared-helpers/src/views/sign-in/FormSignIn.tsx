import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Heading } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import { FormSignInErrorBox } from "./FormSignInErrorBox"
import { NetworkStatus } from "../../auth/catchNetworkError"
import type { UseFormMethods } from "react-hook-form"
import { BloomCard } from "../components/BloomCard"
import { useRouter } from "next/router"
import { getListingRedirectUrl } from "../../utilities/getListingRedirectUrl"

export type FormSignInProps = {
  control: FormSignInControl
  networkStatus: NetworkStatus
  showRegisterBtn?: boolean
  children: React.ReactNode
}

export type FormSignInControl = {
  errors: UseFormMethods["errors"]
}

export type FormSignInValues = {
  email: string
  password: string
}

const FormSignIn = ({
  children,
  networkStatus,
  showRegisterBtn,
  control: { errors },
}: FormSignInProps) => {
  const router = useRouter()
  const listingIdRedirect = router.query?.listingId as string
  const createAccountUrl = getListingRedirectUrl(listingIdRedirect, "/create-account")

  return (
    <BloomCard iconSymbol="profile" title={t("nav.signIn")} headingPriority={1}>
      <>
        <FormSignInErrorBox
          errors={errors}
          networkStatus={networkStatus}
          errorMessageId={"main-sign-in"}
          className="mx-12"
        />
        <CardSection divider={"inset"}>{children}</CardSection>
        {showRegisterBtn && (
          <CardSection divider={"inset"}>
            <Heading priority={2} size="2xl" className="mb-3">
              {t("authentication.createAccount.noAccount")}
            </Heading>
            {process.env.showPwdless && (
              <div className={"text-label pb-6 text-gray-700"}>
                {t("authentication.signIn.pwdless.createAccountCopy")}
              </div>
            )}
            <Button variant="primary-outlined" href={createAccountUrl}>
              {t("account.createAccount")}
            </Button>
          </CardSection>
        )}
      </>
    </BloomCard>
  )
}

export { FormSignIn as default, FormSignIn }
