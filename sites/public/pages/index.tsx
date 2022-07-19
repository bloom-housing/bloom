import React, { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import {
  AlertBox,
  Hero,
  t,
  SiteAlert,
  ActionBlock,
  LinkButton,
  Icon,
} from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import { ConfirmationModal } from "../src/ConfirmationModal"
import { MetaTags } from "../src/MetaTags"
import { HorizontalScrollSection } from "../lib/HorizontalScrollSection"
import axios from "axios"
import qs from "qs"
import styles from "./index.module.scss"
import {
  EnumListingFilterParamsComparison,
  EnumListingFilterParamsStatus,
  Listing,
} from "@bloom-housing/backend-core/types"
import { getListings } from "../lib/helpers"
import moment from "moment"
import {
  Region,
  regionImageUrls,
  encodeToFrontendFilterString,
} from "@bloom-housing/shared-helpers"

export default function Home({ latestListings, comingSoonListings }) {
  const showLatestListings = false // Disabled for now
  const blankAlertInfo = {
    alertMessage: null,
    alertType: null,
  }
  const [alertInfo, setAlertInfo] = useState(blankAlertInfo)

  const heroTitle = <>{t("welcome.title")}</>

  const heroInset: React.ReactNode = (
    <>
      <Link href="/listings">
        <a className="hero__button hero__home-button">{t("welcome.seeRentalListings")}</a>
      </Link>
    </>
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
  const RegionButton = (props: { region: [string, Region] }) => (
    <a
      className={styles.region}
      href={`/listings/filtered?page=1${encodeToFrontendFilterString({
        region: props.region[1],
      })}`}
    >
      <img src={`${regionImageUrls.get(props.region[1])}`} />
      <p className={styles.region__text}>{props.region[1]}</p>
    </a>
  )

  const ComingSoonButton = () => (
    <LinkButton
      href={`/listings/filtered?page=1${encodeToFrontendFilterString({
        availability: "comingSoon",
      })}`}
    >
      {t("welcome.comingSoonButton")}
    </LinkButton>
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
      <Hero
        title={heroTitle}
        backgroundImage={"/images/hero-main.jpg"}
        heroInset={heroInset}
        innerClassName="max-w-2xl mx-auto p-8 rounded-xl"
      >
        <p className="max-w-md mx-auto">{t("welcome.heroText")}</p>
      </Hero>
      {showLatestListings && latestListings?.items && (
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
      {comingSoonListings?.items?.length > 0 && (
        <div className={styles["section-container"]}>
          <section className={`coming-soon-listings`}>
            <div className={`${styles["title"]}`}>
              <Icon size="xlarge" symbol="clock" ariaHidden={true} />
              <h2>{t("listings.comingSoon")}</h2>
            </div>
            <div className={`${styles["cards-container"]}`}>
              {getListings(comingSoonListings?.items)}
            </div>
            <div className={`${styles["title"]}`}>
              <ComingSoonButton />
            </div>
          </section>
        </div>
      )}
      <div className={styles["region-background"]}>
        <div className={styles["section-container"]}>
          <section className={styles.regions}>
            <div className={`${styles["title"]}`}>
              <Icon size="xlarge" symbol={"map"} className={styles.icon} ariaHidden={true} />
              <h2>{t("welcome.cityRegions")}</h2>
            </div>
            <div className={styles["cards-container"]}>
              {Object.entries(Region).map((region, index) => (
                <RegionButton region={region} key={index} />
              ))}
            </div>
          </section>
        </div>
      </div>
      <section className="homepage-extra">
        <div className="action-blocks mt-4 mb-4 w-full">
          <ActionBlock
            className="flex-1 has-bold-header"
            header={t("welcome.signUp")}
            icon={<Icon size="3xl" symbol="mailThin" />}
            actions={[
              <LinkButton
                key={"sign-up"}
                href={
                  "https://public.govdelivery.com/accounts/MIDETROIT/subscriber/new?topic_id=MIDETROIT_415"
                }
                linkProps={{
                  target: "_blank",
                }}
              >
                {t("welcome.signUpToday")}
              </LinkButton>,
            ]}
          />
          <ActionBlock
            className="flex-1 has-bold-header"
            header={t("welcome.seeMoreOpportunitiesTruncated")}
            icon={<Icon size="3xl" symbol="building" />}
            actions={[
              <LinkButton href="/additional-resources" key={"additional-resources"}>
                {t("welcome.viewAdditionalHousingTruncated")}
              </LinkButton>,
            ]}
          />
        </div>
      </section>

      <ConfirmationModal
        setSiteAlertMessage={(alertMessage, alertType) => setAlertInfo({ alertMessage, alertType })}
      />
    </Layout>
  )
}

export async function getStaticProps() {
  let latestListings = []
  let comingSoonListings = []
  try {
    const latestResponse = await axios.get(process.env.listingServiceUrl, {
      params: {
        limit: 5,
        orderBy: "mostRecentlyUpdated",
        availability: "hasAvailability",
        view: "base",
        filter: [
          {
            $comparison: EnumListingFilterParamsComparison["="],
            status: EnumListingFilterParamsStatus.active,
          },
        ],
      },
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
    })
    latestListings = latestResponse.data
  } catch (error) {
    console.error(error)
  }

  try {
    const comingSoonResponse = await axios.get(process.env.listingServiceUrl, {
      params: {
        limit: 3,
        view: "base",
        orderBy: "comingSoon",
        filter: [
          {
            $comparison: EnumListingFilterParamsComparison["="],
            status: EnumListingFilterParamsStatus.active,
            marketingType: "comingSoon",
          },
        ],
      },
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
    })
    comingSoonListings = comingSoonResponse.data
  } catch (error) {
    console.error(error)
  }

  return { props: { latestListings, comingSoonListings }, revalidate: process.env.cacheRevalidate }
}
