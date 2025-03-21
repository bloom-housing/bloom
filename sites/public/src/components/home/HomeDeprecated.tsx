import React, { useContext, useEffect } from "react"
import Head from "next/head"
import { t, ActionBlock, InfoCard } from "@bloom-housing/ui-components"
import { ActionBlockBackground, DoorwayHero } from "@bloom-housing/doorway-ui-components"
import { Button, Heading } from "@bloom-housing/ui-seeds"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { ConfirmationModal } from "../../components/account/ConfirmationModal"
import { MetaTags } from "../../components/shared/MetaTags"
import { Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { LandingSearch } from "../listings/search/LandingSearch"
import { FormOption } from "../listings/search/ListingsSearchModal"
import { locations } from "../../components/listings/search/ListingsSearchCombined"

interface HomeDeprecatedProps {
  jurisdiction: Jurisdiction
  bedrooms: FormOption[]
  counties: FormOption[]
}

export const HomeDeprecated = (props: HomeDeprecatedProps) => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Doorway Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const notificationsSignUpURL = process.env.notificationsSignUpUrl
  const mtcDataUrl = process.env.mtcDataUrl
  const metaDescription = t("pageDescription.welcome")
  const metaImage = t("welcome.personWithChildAlt")
  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <DoorwayHero
        title={t("welcome.findAffordableHousing")}
        offsetImage={"images/person-with-child.jpg"}
        offsetImageAlt={t("welcome.personWithChildAlt")}
      >
        <LandingSearch bedrooms={props.bedrooms} counties={locations} />
      </DoorwayHero>
      {notificationsSignUpURL && (
        <ActionBlock
          className="px-6 py-8 md:py-12"
          header={
            <Heading size="3xl" priority={2}>
              {t("t.signUpForAlerts")}
            </Heading>
          }
          subheader={t("t.subscribeToListingAlerts")}
          background={"secondary-lighter"}
          actions={[
            <Button
              key={"sign-up"}
              variant="primary-outlined"
              href={notificationsSignUpURL}
              newWindowTarget
              hideExternalLinkIcon
            >
              {t("t.signUp")}
            </Button>,
          ]}
        />
      )}
      <div className="homepage-extra warn">
        <div className="action-blocks pb-4 pt-4 w-full space-between items-start">
          <InfoCard
            title={t("welcome.haveQuestions")}
            className="flex-1 is-inline is-normal text-left"
          >
            <img
              src={"images/person-laptop.jpg"}
              alt={t("welcome.personLaptopAlt")}
              className={"mt-4 mb-4 rounded-3xl"}
            />
            <ul className="text__medium-normal list-disc ml-5 mb-6">
              <li>{t("welcome.whatHappens")}</li>
              <li>{t("welcome.incomeAffectRent")}</li>
              <li>{t("welcome.whatDoesAffordableMean")}</li>
            </ul>
            <Button key={"learn-more"} href={"/help/questions"} variant={"secondary"}>
              {t("welcome.learnMore")}
            </Button>
          </InfoCard>
          <InfoCard
            title={t("welcome.needOtherHelp")}
            className="flex-1 is-inline is-normal text-left"
          >
            <img
              src={"images/person-holding-hands.jpg"}
              alt={t("welcome.peopleHoldingHandsAlt")}
              className={"mt-4 mb-4 rounded-3xl"}
            />
            <p className="text-gray-950 text__medium-normal mb-4">
              {t("welcome.emergencyHousing")}
            </p>
            <p className="text-gray-950 text__medium-normal mb-6">
              {t("welcome.emergencyHousingResources")}
            </p>
            <Button key={"get-help"} href={"/help/housing-help"} variant={"secondary"}>
              {t("welcome.getHelp")}
            </Button>
          </InfoCard>
        </div>
      </div>
      {mtcDataUrl && (
        <ActionBlock
          className="px-6 py-8 md:py-12"
          header={
            <Heading size="3xl" priority={2}>
              {t("t.seeTheData")}
            </Heading>
          }
          subheader={t("t.getApplicationAndData")}
          background={ActionBlockBackground.primaryLightest}
          actions={[
            <Button
              key={"seeTheData"}
              variant="primary-outlined"
              href={mtcDataUrl}
              newWindowTarget
              hideExternalLinkIcon
            >
              {t("t.seeTheData")}
            </Button>,
          ]}
        />
      )}
      <ConfirmationModal />
    </Layout>
  )
}
