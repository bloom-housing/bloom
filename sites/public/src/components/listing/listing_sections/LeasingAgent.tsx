import * as React from "react"
import { Card, Heading, Link } from "@bloom-housing/ui-seeds"
import { Address as AddressType } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Address } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import styles from "../ListingViewSeeds.module.scss"

type LeasingAgentProps = {
  address?: AddressType
  email?: string
  name?: string
  officeHours?: string
  phone?: string
  title?: string
  managementWebsite?: string
}

export const formatPhone = (phone: string) => {
  return phone.replace(/[-() ]/g, "")
}

export const LeasingAgent = ({
  address,
  email,
  name,
  officeHours,
  phone,
  title,
  managementWebsite,
}: LeasingAgentProps) => {
  if (!address && !email && !name && !officeHours && !phone && !managementWebsite) return
  return (
    <Card className={`${styles["mobile-full-width-card"]} ${styles["mobile-no-bottom-border"]}`}>
      <Card.Section>
        <Heading size={"lg"} priority={2} className={"seeds-m-be-header"}>
          {t("leasingAgent.contact")}
        </Heading>
        {name && <p className={`${styles["thin-heading"]} seeds-m-be-text`}>{name}</p>}
        {title && <p>{title}</p>}
        {phone && (
          <>
            <p className={"seeds-m-bs-header seeds-m-be-text"}>
              <Link href={`tel:${formatPhone(phone)}`}>{`${t("t.call")} ${phone}`}</Link>
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
