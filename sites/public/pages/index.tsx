import React, { useState } from "react"
import Head from "next/head"
import { AlertBox, Hero, t, SiteAlert } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import { ConfirmationModal } from "../src/ConfirmationModal"
import { MetaTags } from "../src/MetaTags"
import { HorizontalScrollSection } from "../lib/HorizontalScrollSection"
import styles from "./index.module.scss"

export default function Home() {
  const blankAlertInfo = {
    alertMessage: null,
    alertType: null,
  }

  const [alertInfo, setAlertInfo] = useState(blankAlertInfo)

  // TODO(https://github.com/CityOfDetroit/bloom/issues/712): avoid concatenating translated strings
  const heroTitle = (
    <>
      {t("welcome.title")} {t("region.name")}
    </>
  )

  const heroInset: React.ReactNode = (
    <div className="hero__inset">
      <div className="hero__text">{t("welcome.heroText")}</div>
      <a href="/listings" className="hero__button__first hero__button">
        {t("welcome.seeRentalListings")}
      </a>
      <a href="/eligibility/welcome" className="hero__button__second hero__button">
        {t("welcome.checkEligibility")}
      </a>
    </div>
  )
  interface LatestListingLinkProps {
    name: string
    address: string
    availability: string
  }

  const LatestListingsLink = (props: LatestListingLinkProps) => (
    <a className={styles["latest-listing"]} href="/listings">
      <h3 className={styles["latest-listing__name"]}>{props.name}</h3>
      <p className={styles["latest-listing__address"]}>{props.address}</p>
      <div className={styles["latest-listing__availability"]}>{props.availability}</div>
    </a>
  )

  // TODO(#674): Fill out neighborhood buttons with real data
  const NeighborhoodButton = (props: { label: string }) => (
    <a className={styles.neighborhood} href="/listings">
      <p className={styles.neighborhood__text}>{props.label}</p>
    </a>
  )

  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image
  const alertClasses = "flex-grow mt-6 max-w-6xl w-full"
  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <div className="flex absolute w-full flex-col items-center">
        <SiteAlert type="alert" className={alertClasses} />
        <SiteAlert type="success" className={alertClasses} timeout={30000} />
      </div>
      {alertInfo.alertMessage && (
        <AlertBox
          className=""
          onClose={() => setAlertInfo(blankAlertInfo)}
          type={alertInfo.alertType}
        >
          {alertInfo.alertMessage}
        </AlertBox>
      )}
      <Hero title={heroTitle} backgroundImage={"/images/hero.png"} heroInset={heroInset} />
      {/* TODO(#672): Translate title */}
      <HorizontalScrollSection
        title="Latest listings"
        subtitle="Last updated 2/12/22"
        scrollAmount={560}
        icon="clock"
        className={styles["latest-listings"]}
      >
        {/* TODO(#672): Populate with real data */}
        <LatestListingsLink
          name="New Center Square"
          address="112 Seward Avenue, Detroit, MI 48202"
          availability="3 br available, 2br available"
        />
        <LatestListingsLink
          name="Treymore Apartments"
          address="457 Brainard St, Detroit, MI 48201"
          availability="3 br available, 2br available"
        />
        <LatestListingsLink
          name="New Center Square"
          address="112 Seward Avenue, Detroit, MI 48202"
          availability="3 br available, 2br available"
        />
        <LatestListingsLink
          name="New Center Square"
          address="112 Seward Avenue, Detroit, MI 48202"
          availability="3 br available, 2br available"
        />
        <LatestListingsLink
          name="New Center Square"
          address="112 Seward Avenue, Detroit, MI 48202"
          availability="3 br available, 2br available"
        />
      </HorizontalScrollSection>
      {/* TODO(#674): Translate title*/}
      <HorizontalScrollSection
        title="Neighborhoods"
        scrollAmount={311}
        icon="map"
        className={styles.neighborhoods}
      >
        <NeighborhoodButton label="Midtown" />
        <NeighborhoodButton label="Elmwood Park" />
        <NeighborhoodButton label="Islandview" />
        <NeighborhoodButton label="Brightmoor" />
        <NeighborhoodButton label="Fox Creek" />
      </HorizontalScrollSection>
      <ConfirmationModal
        setSiteAlertMessage={(alertMessage, alertType) => setAlertInfo({ alertMessage, alertType })}
      />
    </Layout>
  )
}
