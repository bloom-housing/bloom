import * as React from "react"
import { t } from "@bloom-housing/ui-components"
import { Link } from "@bloom-housing/ui-seeds"
import { InfoCard } from "./InfoCard"
import styles from "../ListingViewSeeds.module.scss"

type FurtherInformationProps = {
  instructions?: string
  phoneNumber?: string
}

export const FurtherInformation = ({ instructions, phoneNumber }: FurtherInformationProps) => {
  return (
    <InfoCard heading={t("application.referralApplication.furtherInformation")}>
      <>
        {phoneNumber && (
          <p className={"seeds-m-be-text"}>
            <Link
              className={styles["link-no-gap"]}
              href={`tel:${phoneNumber.replace(/[-()]/g, "")}`}
              aria-label={`${t("t.call")} ${phoneNumber}`}
            >
              {t("t.call")}
              &nbsp;
              <span dir="ltr">{phoneNumber}</span>
            </Link>
          </p>
        )}
        <p>{instructions || t("application.referralApplication.instructions")}</p>
      </>
    </InfoCard>
  )
}
