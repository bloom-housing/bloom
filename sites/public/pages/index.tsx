import React, { useState } from "react"
import Head from "next/head"
import { Listing } from "@bloom-housing/backend-core/types"
import {
  AlertBox,
  LinkButton,
  Hero,
  MarkdownSection,
  t,
  SiteAlert,
} from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import axios from "axios"
import { ConfirmationModal } from "../src/ConfirmationModal"
import { MetaTags } from "../src/MetaTags"

interface IndexProps {
  listings: Listing[]
}

export default function Home(props: IndexProps) {
  const blankAlertInfo = {
    alertMessage: null,
    alertType: null,
  }

  const [alertInfo, setAlertInfo] = useState(blankAlertInfo)

  const heroTitle = (
    <>
      {t("welcome.title")} <em>{t("region.name")}</em>
    </>
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
        buttonTitle={t("welcome.seeRentalListings")}
        buttonLink="/listings"
        listings={props.listings}
        centered
      />
      <div className="homepage-extra">
        <MarkdownSection fullwidth={true}>
          <>
            <p>{t("welcome.seeMoreOpportunities")}</p>
            <LinkButton href="/additional-resources">
              {t("welcome.viewAdditionalHousing")}
            </LinkButton>
          </>
        </MarkdownSection>
      </div>
      <ConfirmationModal
        setSiteAlertMessage={(alertMessage, alertType) => setAlertInfo({ alertMessage, alertType })}
      />
    </Layout>
  )
}

export async function getStaticProps() {
  let listings = []
  try {
    const response = await axios.get(process.env.listingServiceUrl)
    listings = response.data
  } catch (error) {
    console.error(error)
  }

  return { props: { listings } }
}
