import React, { useContext, useEffect, useState } from "react"
import Head from "next/head"
import { Jurisdiction } from "@bloom-housing/backend-core/types"
import {
  AlertBox,
  LinkButton,
  Heading,
  t,
  SiteAlert,
  AppearanceSizeType,
} from "@bloom-housing/ui-components"
import { ActionBlock, DoorwayHero, InfoCard } from "@bloom-housing/doorway-ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import { ConfirmationModal } from "../components/account/ConfirmationModal"
import { MetaTags } from "../components/shared/MetaTags"
import { fetchJurisdictionByName } from "../lib/hooks"
import { runtimeConfig } from "../lib/runtime-config"

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
      pageTitle: "🚪 Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const metaDescription = t("welcome.findAffordableHousing", { regionName: t("region.name") })
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
      <DoorwayHero
        title={t("welcome.findAffordableHousing")}
        offsetImage={"images/placeholder_temp_delete_me.jpg"}
      >
        <p className="bg-gray-300 h-64">TODO: Add search component here</p>
      </DoorwayHero>
      <ActionBlock
        className="p-12"
        header={<Heading priority={2}>{t("welcome.introduction")}</Heading>}
        subheader={t("welcome.useDoorway")}
        background="secondary-lighter"
        actions={[
          <LinkButton
            className="is-borderless is-inline is-unstyled underline text-primary-lighter"
            href="/additional-resources"
            key={"additional-resources"}
            size={AppearanceSizeType.small}
            normalCase
            icon="arrowForward"
            iconPlacement="right"
          >
            {t("welcome.learnHowToUseDoorway")}
          </LinkButton>,
        ]}
      />
      <div className="homepage-extra warn">
        <div className="action-blocks pb-4 pt-4 w-full space-between items-start">
          <InfoCard title="I am a title" className="flex-1 is-inline is-normal text-left">
            <img
              src={"images/placeholder_temp_delete_me.jpg"}
              alt={"temporary"}
              className={"mt-4 mb-4 rounded-3xl"}
            />
            <ul className="text__medium-normal list-disc ml-5">
              <li>List Item 1</li>
              <li>List Item 2</li>
            </ul>
            <p className="text-gray-950 text__medium-normal mb-4 font-semibold">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, labore animi autem
              rerum nostrum impedit amet velit, eveniet perspiciatis maiores tenetur natus porro
              tempore atque ad praesentium hic eos cupiditate!
            </p>
            <LinkButton
              key={"temporary"}
              className="is-primary"
              href={props.jurisdiction.notificationsSignUpURL}
              size={AppearanceSizeType.small}
            >
              Blah blah
            </LinkButton>
          </InfoCard>
          <InfoCard title={"I am another title"} className="flex-1 is-inline is-normal text-left">
            <img
              src={"images/placeholder_temp_delete_me.jpg"}
              alt={"temporary"}
              className={"mt-4 mb-4 rounded-3xl"}
            />
            <ul className="text__medium-normal list-disc ml-5">
              <li>List Item 1</li>
              <li>List Item 2</li>
              <li>List Item 3</li>
              <li>List Item 4</li>
            </ul>
            <LinkButton
              key={"temporary"}
              className="is-primary"
              href={props.jurisdiction.notificationsSignUpURL}
              size={AppearanceSizeType.small}
            >
              Blah blah
            </LinkButton>
          </InfoCard>
        </div>
      </div>
      {props.jurisdiction && props.jurisdiction.notificationsSignUpURL && (
        <ActionBlock
          className="p-12"
          header={
            <Heading className="" priority={2}>
              {t("t.signUpForAlerts")}
            </Heading>
          }
          subheader={t("t.subscribeToNewsletter")}
          background="primary-lightest"
          actions={[
            <LinkButton
              key={"sign-up"}
              className="is-primary"
              href={props.jurisdiction.notificationsSignUpURL}
              size={AppearanceSizeType.small}
            >
              {t("t.signUp")}
            </LinkButton>,
          ]}
        />
      )}
      <ConfirmationModal
        setSiteAlertMessage={(alertMessage, alertType) => setAlertInfo({ alertMessage, alertType })}
      />
    </Layout>
  )
}

export async function getServerSideProps() {
  const jurisdiction = await fetchJurisdictionByName(
    runtimeConfig.getBackendApiBase(),
    runtimeConfig.getJurisdictionName()
  )

  return {
    props: { jurisdiction },
  }
}
