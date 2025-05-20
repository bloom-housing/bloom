import { useState } from "react"
import Link from "next/link"
import Head from "next/head"
import { Card, Dialog, Grid, Heading } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import { GridRow } from "@bloom-housing/ui-seeds/src/layout/Grid"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"
import ResourceSection from "../resources/ResourceSection"
import styles from "./HousingBasics.module.scss"
import Layout from "../../layouts/application"
import VideoCard from "../shared/VideoCard"
import ResourceCard from "../resources/ResourceCard"
import Markdown from "markdown-to-jsx"

const HousingBasics = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null)
  const [modalUrl, setModalUrl] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const pageTitle = t("pageTitle.housingBasics")

  const updateModal = (videoTitle: string, videoID: string) => {
    setModalTitle(videoTitle)
    setModalUrl(`https://www.youtube.com/embed/${videoID}`)
    setModalOpen(true)
  }

  return (
    <>
      <Layout>
        <Head>
          <title>
            {pageTitle} - {t("nav.siteTitle")}
          </title>
        </Head>
        <PageHeaderLayout
          inverse
          heading={pageTitle}
          subheading={t("pageDescription.housingBasics")}
          className={styles["site-layout"]}
        >
          <article className={styles["site-content"]}>
            <div className={styles["resources-section-wrapper"]}>
              <ResourceSection
                sectionTitle={t("basicsVideo.sectionTitle")}
                sectionSubtitle={t("basicsVideo.sectionSubtitle")}
              >
                <Grid spacing="sm">
                  <GridRow columns={2}>
                    <VideoCard
                      title={t("basicsVideo.affordableHousing")}
                      content={t("basicsVideo.affordableHousingSubtitle")}
                      onClick={() => updateModal(t("basicsVideo.affordableHousing"), "cqd1IlIm1HM")}
                    />
                    <VideoCard
                      title={t("basicsVideo.incomeRestrictions")}
                      content={t("basicsVideo.incomeRestrictionsSubtitle")}
                      onClick={() =>
                        updateModal(t("basicsVideo.incomeRestrictions"), "jknVMnyXEW8")
                      }
                    />
                    <VideoCard
                      title={t("basicsVideo.application")}
                      content={t("basicsVideo.applicationSubtitle")}
                      onClick={() => updateModal(t("basicsVideo.application"), "39KLpIXiPDI")}
                    />
                    <VideoCard
                      title={t("basicsVideo.waitlist")}
                      content={t("basicsVideo.waitlistSubtitle")}
                      onClick={() => updateModal(t("basicsVideo.waitlist"), "CZ8UVjdCcA8")}
                    />
                    <VideoCard
                      title={t("basicsVideo.residentTutorial")}
                      content={t("basicsVideo.residentTutorialSubtitle")}
                      onClick={() => updateModal(t("basicsVideo.residentTutorial"), "Flc5EIqO6ak")}
                    />
                  </GridRow>
                </Grid>
              </ResourceSection>
              <ResourceSection sectionTitle={t("basicsCard.sectionTitle")}>
                <Grid>
                  <GridRow columns={2}>
                    <ResourceCard
                      title={t("basicsResources.affordableHousingGlossary")}
                      content={t("basicsResources.affordableHousingGlossaryDescription")}
                      href={
                        "https://res.cloudinary.com/exygy/image/upload/v1660061018/Detroit_Affordable_Housing_Glossary_c1oel8.pdf"
                      }
                    />
                  </GridRow>
                </Grid>
              </ResourceSection>
            </div>
            <aside className={styles["aside-section"]}>
              <Card className={styles["contact-card"]}>
                <div className={styles["contact-card-subsection"]}>
                  <Heading size="xl" priority={2}>
                    {t("t.contact")}
                  </Heading>
                  <p className={styles["contact-card-info"]}>{t("contact.cityOfDetroitTitle")}</p>
                  <p className={styles["contact-card-descriptieon"]}>
                    {t("contact.cityOfDetroitDescription")}
                  </p>
                </div>
                <div className={styles["contact-card-subsection"]}>
                  <Markdown>{t("contact.generalInquiries")}</Markdown>
                </div>
              </Card>
            </aside>
          </article>
        </PageHeaderLayout>
      </Layout>
      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        ariaLabelledBy="video"
        ariaDescribedBy="video-details"
        className={styles["custom-class-dialog"]}
      >
        <Dialog.Header id="video">{modalTitle}</Dialog.Header>
        <Dialog.Content id="video-details" className={styles["custom-class-video-content"]}>
          <div className={styles["custom-class-video-wrapper"]}>
            <iframe
              title={modalTitle}
              src={modalUrl}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className={styles["custom-class-video"]}
            />
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}

export default HousingBasics
