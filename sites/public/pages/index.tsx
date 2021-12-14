import React, { useState } from "react"
import Head from "next/head"
import { AlertBox, Hero, t, SiteAlert } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import { ConfirmationModal } from "../src/ConfirmationModal"
import { MetaTags } from "../src/MetaTags"
import { HorizontalScrollSection } from "../lib/HorizontalScrollSection"
import axios from "axios"
import styles from "./index.module.scss"
import { Listing } from "@bloom-housing/backend-core/types"
import { getListings } from "../lib/helpers"
import moment from "moment"

export default function Home({ latestListings }) {
  const blankAlertInfo = {
    alertMessage: null,
    alertType: null,
  }

  const [alertInfo, setAlertInfo] = useState(blankAlertInfo)

  const heroTitle = <>{t("welcome.title")}</>

  const heroInset: React.ReactNode = (
    <div>
      <a href="/listings" className="hero__button__first hero__button">
        {t("welcome.seeRentalListings")}
      </a>
      <a href="/eligibility/welcome" className="hero__button__second hero__button">
        {t("welcome.findRentalsForMe")}
      </a>
    </div>
  )

  /**
   * Get the listing with the latest 'updatedAt' field and format it
   *
   * @param listings
   * @returns
   */
  const getLastUpdatedString = (listings: Array<Listing>) => {
    // Get the latest updateAt date and format it as localized 'MM/D/YYYY'
    const latestDate = moment
      .max(
        listings.map((listing) => {
          return moment(listing.updatedAt)
        })
      )
      .format("l")
    return t("welcome.lastUpdated", { date: latestDate })
  }

  // TODO(#674): Fill out region buttons with real data
  const RegionButton = (props: { label: string; image?: string }) => (
    <a
      className={styles.region}
      href="/listings"
      style={{ backgroundImage: `url(${props.image})` }}
    >
      <p className={styles.region__text}>{props.label}</p>
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
      {latestListings && latestListings.items && (
        <HorizontalScrollSection
          title={t("welcome.latestListings")}
          subtitle={getLastUpdatedString(latestListings.items)}
          scrollAmount={560}
          icon="clock"
          className={`${styles["latest-listings"]} latest-listings`}
        >
          {getListings(latestListings.items)}
        </HorizontalScrollSection>
      )}
      <HorizontalScrollSection
        title={t("welcome.cityRegions")}
        scrollAmount={311}
        icon="map"
        className={styles.regions}
      >
        {/* TODO(#674): Get official hosted images */}
        <RegionButton
          label="Downtown"
          image="https://pbs.twimg.com/media/DSzZwQKVAAASkw_?format=jpg&name=large"
        />
        <RegionButton
          label="Eastside"
          image="https://d12kp1agyyb87s.cloudfront.net/wp-content/uploads/2019/10/image001.jpg"
        />
        <RegionButton
          label="Westside"
          image="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Atkinson_avenue_historic_district.JPG/1920px-Atkinson_avenue_historic_district.JPG"
        />
        <RegionButton
          label="Southwest"
          image="https://www.theneighborhoods.org/sites/the-neighborhoods/files/2020-10/Southwest-Mural_1.jpg"
        />
        <RegionButton
          label="Midtown - New Center"
          image="https://cdn.pixabay.com/photo/2019/03/17/04/00/detroit-4060269_960_720.jpg"
        />
      </HorizontalScrollSection>
      <ConfirmationModal
        setSiteAlertMessage={(alertMessage, alertType) => setAlertInfo({ alertMessage, alertType })}
      />
    </Layout>
  )
}

export async function getStaticProps() {
  let latestListings = []
  try {
    const response = await axios.get(process.env.listingServiceUrl, {
      params: {
        limit: 5,
        orderBy: "mostRecentlyUpdated",
        availability: "hasAvailability",
      },
    })
    latestListings = response.data
  } catch (error) {
    console.error(error)
  }
  return { props: { latestListings }, revalidate: process.env.cacheRevalidate }
}
