import React, { useState } from "react"
import Markdown from "markdown-to-jsx"
import { MarkdownSection, t, MediaCard, Video } from "@bloom-housing/ui-components"
import { PageHeader } from "../../../../detroit-ui-components/src/headers/PageHeader"
import { InfoCardGrid } from "../../../../detroit-ui-components/src/sections/InfoCardGrid"
import { Modal } from "../../../../detroit-ui-components/src/overlays/Modal"
import Layout from "../layouts/application"
import RenderIf from "../RenderIf"
import sidebarContent from "../page_content/resources/sidebar.md"
import { useRouter } from "next/router"
import Resource from "../Resource"
import housingGlossary from "../page_content/resources/housing_glossary.md"

export default function HousingBasics() {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [currentVideoID, setCurrentVideoId] = useState<string>("")
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>("")
  const language = useRouter()?.locale

  const updateModal = (videoTitle: string, videoID: string) => {
    setCurrentVideoId(videoID)
    setCurrentVideoTitle(videoTitle)
    setOpenModal(true)
  }
  return (
    <Layout>
      <PageHeader
        title={t("pageTitle.housingBasics")}
        subtitle={t("pageDescription.housingBasics")}
        inverse
      />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={currentVideoTitle}
        modalClassNames={"media-modal"}
        innerClassNames={"p-0"}
      >
        <Video label={currentVideoTitle} videoId={currentVideoID} ccLang={language} />
      </Modal>
      <section className="md:px-5 md:my-12 my-6">
        <article className="max-w-5xl m-auto md:flex">
          <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs px-4 md:px-8 ">
            <InfoCardGrid
              title={t("basicsVideo.sectionTitle")}
              subtitle={t("basicsVideo.sectionSubtitle")}
            >
              <div className={"media-grid"}>
                <MediaCard
                  title={t("basicsVideo.affordableHousing")}
                  subtitle={t("basicsVideo.affordableHousingSubtitle")}
                  handleClick={() => updateModal(t("basicsVideo.affordableHousing"), "cqd1IlIm1HM")}
                  className={"media-grid__cell"}
                />
                <MediaCard
                  title={t("basicsVideo.incomeRestrictions")}
                  subtitle={t("basicsVideo.incomeRestrictionsSubtitle")}
                  handleClick={() =>
                    updateModal(t("basicsVideo.incomeRestrictions"), "jknVMnyXEW8")
                  }
                  className={"media-grid__cell"}
                />
                <MediaCard
                  title={t("basicsVideo.application")}
                  subtitle={t("basicsVideo.applicationSubtitle")}
                  handleClick={() => updateModal(t("basicsVideo.application"), "39KLpIXiPDI")}
                  className={"media-grid__cell"}
                />
                <MediaCard
                  title={t("basicsVideo.waitlist")}
                  subtitle={t("basicsVideo.waitlistSubtitle")}
                  handleClick={() => updateModal(t("basicsVideo.waitlist"), "CZ8UVjdCcA8")}
                  className={"media-grid__cell"}
                />
                <MediaCard
                  title={t("basicsVideo.residentTutorial")}
                  subtitle={t("basicsVideo.residentTutorialSubtitle")}
                  handleClick={() => updateModal(t("basicsVideo.residentTutorial"), "Flc5EIqO6ak")}
                  className={"media-grid__cell"}
                />
              </div>
            </InfoCardGrid>
            <MarkdownSection padding={false}>
              <InfoCardGrid title={t("basicsCard.sectionTitle")}>
                <Resource>{housingGlossary}</Resource>
              </InfoCardGrid>
            </MarkdownSection>
          </div>
          <aside className="pt-4 pb-10 md:w-4/12 md:pl-4 md:py-0 md:border-s">
            <MarkdownSection>
              <Markdown
                options={{
                  overrides: {
                    h3: {
                      component: ({ children, ...props }) => (
                        <h3 {...props} className="text-tiny text-caps-underline">
                          {children}
                        </h3>
                      ),
                    },
                    RenderIf,
                  },
                }}
              >
                {sidebarContent}
              </Markdown>
            </MarkdownSection>
          </aside>
        </article>
      </section>
    </Layout>
  )
}
