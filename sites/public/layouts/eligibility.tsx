import Layout from "./application"
import styles from "./Eligibility.module.scss"
import { ApplicationTimeout } from "../src/forms/applications/ApplicationTimeout"
import React, { useContext } from "react"
import { ProgressNav, t } from "@bloom-housing/ui-components"
import { EligibilityContext } from "../lib/EligibilityContext"
import { ELIGIBILITY_SECTIONS } from "../lib/constants"
import { eligibilityRoute } from "../lib/helpers"

const EligibilityLayout = (props) => {
  const { eligibilityRequirements } = useContext(EligibilityContext)

  return (
    <>
      <ApplicationTimeout />
      <Layout>
        <section className="bg-white">
          <h2 className={styles.eligibility_header}>{t("eligibility.progress.header")}</h2>
          <div className="bg-gray-200">
            <div className={`mx-auto ${styles.eligibility_contents}`}>
              <ProgressNav
                currentPageSection={props.currentPageSection}
                completedSections={eligibilityRequirements.completedSections}
                labels={ELIGIBILITY_SECTIONS.map((label) =>
                  t(`eligibility.progress.sections.${label}`)
                )}
                routes={ELIGIBILITY_SECTIONS.map((_label, i) => eligibilityRoute(i))}
              />
            </div>
          </div>
          <div className={`mx-auto ${styles.eligibility_contents}`}>{props.children}</div>
        </section>
      </Layout>
    </>
  )
}

export default EligibilityLayout
