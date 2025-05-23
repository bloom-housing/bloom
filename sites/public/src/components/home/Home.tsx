import React, { useContext, useEffect } from "react"
import Head from "next/head"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { Button, Heading } from "@bloom-housing/ui-seeds"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { ConfirmationModal } from "../../components/account/ConfirmationModal"
import { MetaTags } from "../../components/shared/MetaTags"
import MaxWidthLayout from "../../layouts/max-width"
import styles from "./Home.module.scss"
import { HomeSection } from "./HomeSection"
import { HomeRegions } from "./HomeRegions"
import { HomeResources } from "./HomeResources"

interface HomeProps {
  jurisdiction: Jurisdiction
}

export const Home = (props: HomeProps) => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const heroTitle = `${t("welcome.title")} ${t("region.name")}`

  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })

  const enableRegions =
    props.jurisdiction?.featureFlags.find((flag) => flag.name === FeatureFlagEnum.enableRegions)
      ?.active || false

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} description={metaDescription} />
      <div className={styles["home-page"]}>
        <MaxWidthLayout className={styles["hero-container"]}>
          <div className={styles["hero"]}>
            <Heading priority={1} className={styles["heading"]}>
              {heroTitle}
            </Heading>
            <p className={styles["subtitle"]}>{t("welcome.subtitle")}</p>
            <Button href="/listings" variant="primary-outlined" className={styles["hero-button"]}>
              {t("welcome.seeRentalListings")}
            </Button>
          </div>
        </MaxWidthLayout>
        {enableRegions && (
          <HomeSection sectionTitle={t("welcome.cityRegions")} sectionIcon="mapPin">
            <HomeRegions />
          </HomeSection>
        )}
        <HomeSection
          sectionTitle={t("welcome.resources")}
          sectionIcon="listBullet"
          layoutClassName={styles["resource-container"]}
        >
          <HomeResources jurisdiction={props.jurisdiction} />
        </HomeSection>
        <ConfirmationModal />
      </div>
    </Layout>
  )
}
