import React, { useContext, useEffect, useState } from "react"
import Head from "next/head"
import { Jurisdiction } from "@bloom-housing/backend-core/types"
import { Button, Heading, Link } from "@bloom-housing/ui-seeds"
import { AlertBox, t, SiteAlert, ActionBlock, Icon } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import { ConfirmationModal } from "../components/account/ConfirmationModal"
import { MetaTags } from "../components/shared/MetaTags"
import { fetchJurisdictionByName } from "../lib/hooks"
import PageHero from "../components/page/Hero"

interface IndexProps {
  jurisdiction: Jurisdiction
}

export default function Home(props: IndexProps) {
  const blankAlertInfo = {
    alertMessage: null,
    alertType: null,
  }
  const { profile } = useContext(AuthContext)
  const [alertInfo, setAlertInfo] = useState(blankAlertInfo)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

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
      <PageHero>
        <PageHero.Header>
          <Heading>{heroTitle}</Heading>
        </PageHero.Header>
        <PageHero.Actions>
          <Button href="/listings" variant="primary-outlined">
            {t("welcome.seeRentalListings")}
          </Button>
        </PageHero.Actions>
      </PageHero>
      <div className="homepage-extra">
        <div className="action-blocks mt-4 mb-4 w-full">
          {props.jurisdiction && props.jurisdiction.notificationsSignUpURL && (
            <ActionBlock
              className="flex-1"
              header={
                <Heading priority={2} size="2xl">
                  {t("welcome.signUp")}
                </Heading>
              }
              icon={<Icon size="3xl" symbol="mailThin" />}
              actions={[
                <Button
                  key={"sign-up"}
                  href={props.jurisdiction.notificationsSignUpURL}
                  variant="primary-outlined"
                  size="sm"
                  className="m-2"
                >
                  {t("welcome.signUpToday")}
                </Button>,
              ]}
            />
          )}
          <ActionBlock
            className="flex-1"
            header={
              <Heading priority={2} size="2xl">
                {t("welcome.seeMoreOpportunitiesTruncated")}
              </Heading>
            }
            icon={<Icon size="3xl" symbol="building" />}
            actions={[
              <Button
                key={"additional-resources"}
                href="/additional-resources"
                variant="primary-outlined"
                size="sm"
                className="m-2"
              >
                {t("welcome.viewAdditionalHousingTruncated")}
              </Button>,
            ]}
          />
        </div>
      </div>
      <ConfirmationModal
        setSiteAlertMessage={(alertMessage, alertType) => setAlertInfo({ alertMessage, alertType })}
      />
    </Layout>
  )
}

export async function getStaticProps() {
  const jurisdiction = await fetchJurisdictionByName()

  return {
    props: { jurisdiction },
  }
}
