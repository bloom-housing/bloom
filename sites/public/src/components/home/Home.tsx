import React, { useContext, useEffect } from "react"
import Head from "next/head"
import {
  FeatureFlagEnum,
  Jurisdiction,
  Listing,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { ConfirmationModal } from "../../components/account/ConfirmationModal"
import { MetaTags } from "../../components/shared/MetaTags"
import { isFeatureFlagOn } from "../../lib/helpers"
import { Hero } from "../../patterns/Hero"
import { HomeSection } from "./HomeSection"
import { HomeRegions } from "./HomeRegions"
import { HomeResources } from "./HomeResources"
import { HomeUnderConstruction } from "./HomeUnderConstruction"
import styles from "./Home.module.scss"

interface HomeProps {
  jurisdiction: Jurisdiction
  underConstructionListings: Listing[]
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

  const enableRegions = isFeatureFlagOn(props.jurisdiction, FeatureFlagEnum.enableRegions)

  const enableUnderConstruction = isFeatureFlagOn(
    props.jurisdiction,
    FeatureFlagEnum.enableUnderConstructionHome
  )

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} description={metaDescription} />
      <div className={styles["home-page"]}>
        <Hero
          title={heroTitle}
          subtitle={t("welcome.subtitle")}
          action={
            <Button href="/listings" variant="primary-outlined">
              {t("welcome.seeRentalListings")}
            </Button>
          }
        />
        {enableUnderConstruction && props.underConstructionListings.length > 0 && (
          <HomeSection
            sectionTitle={t("listings.underConstruction")}
            sectionIcon="clock"
            layoutClassName={styles["surface-background"]}
          >
            <HomeUnderConstruction
              listings={props.underConstructionListings}
              jurisdiction={props.jurisdiction}
            />
          </HomeSection>
        )}
        {enableRegions && (
          <HomeSection
            sectionTitle={t("welcome.cityRegions")}
            sectionIcon="mapPin"
            layoutClassName={`${styles["muted-background"]}`}
          >
            <HomeRegions />
          </HomeSection>
        )}
        <HomeSection
          sectionTitle={t("welcome.resources")}
          sectionIcon="listBullet"
          layoutClassName={`${styles["resource-container"]} ${
            !enableRegions && !enableRegions
              ? styles["muted-background"]
              : styles["surface-background"]
          }`}
        >
          <HomeResources jurisdiction={props.jurisdiction} />
        </HomeSection>
        <ConfirmationModal />
      </div>
    </Layout>
  )
}
