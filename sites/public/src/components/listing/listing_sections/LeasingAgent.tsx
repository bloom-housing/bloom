import * as React from "react"
import { Card, Heading, Link } from "@bloom-housing/ui-seeds"
import { Address, AuthContext } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import styles from "../ListingViewSeeds.module.scss"
import { FeatureFlagEnum, Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export const formatPhone = (phone: string) => {
  return phone.replace(/[-() ]/g, "")
}

type LeasingAgentProps = {
  listing: Listing
}
export const LeasingAgent = ({ listing }: LeasingAgentProps) => {
  const {
    listingsLeasingAgentAddress: address,
    leasingAgentEmail: email,
    leasingAgentName: name,
    leasingAgentOfficeHours: officeHours,
    leasingAgentPhone: phone,
    leasingAgentTitle: title,
  } = listing
  const { doJurisdictionsHaveFeatureFlagOn } = React.useContext(AuthContext)
  const managementWebsite = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableCompanyWebsite,
    listing.jurisdictions.id
  )
    ? listing.managementWebsite
    : undefined
  if (!address && !email && !name && !officeHours && !title && !phone && !managementWebsite) return

  const enableLeasingAgentAltText = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableLeasingAgentAltText,
    listing.jurisdictions.id
  )

  const leasingAgentContactText = enableLeasingAgentAltText
    ? t("leasingAgent.contactManagerProp")
    : t("leasingAgent.contact")

  return (
    <Card className={`${styles["mobile-full-width-card"]} ${styles["mobile-no-bottom-border"]}`}>
      <Card.Section>
        <Heading size={"lg"} priority={2} className={"seeds-m-be-header"}>
          {leasingAgentContactText}
        </Heading>
        {name && <p className={`${styles["thin-heading"]} seeds-m-be-text`}>{name}</p>}
        {title && <p>{title}</p>}
        {phone && (
          <>
            <p className={"seeds-m-bs-header seeds-m-be-text"}>
              <Link
                className={styles["link-no-gap"]}
                href={`tel:${formatPhone(phone)}`}
                aria-label={`${t("t.call")} ${phone}`}
              >
                {t("t.call")}
                &nbsp;
                <span dir="ltr">{phone}</span>
              </Link>
            </p>
            <p>{t("leasingAgent.dueToHighCallVolume")}</p>
          </>
        )}
        {email && (
          <p className={"seeds-m-bs-header"}>
            <Link href={`mailto:${email}`}>{t("t.email")}</Link>
          </p>
        )}
        {managementWebsite && (
          <p className={"seeds-m-bs-header"}>
            <a
              href={managementWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles["primary-link"]} underline`}
            >
              {t("t.website")}
            </a>
          </p>
        )}
        {address && (
          <div className={"seeds-m-bs-header"}>
            <Address address={address} getDirections={true} />
          </div>
        )}
        {officeHours && (
          <div className={"seeds-m-bs-header"}>
            <Heading
              size={"md"}
              priority={3}
              className={`seeds-m-be-text ${styles["thin-heading-sm"]}`}
            >
              {t("leasingAgent.officeHours")}
            </Heading>
            <p>{officeHours}</p>
          </div>
        )}
      </Card.Section>
    </Card>
  )
}
