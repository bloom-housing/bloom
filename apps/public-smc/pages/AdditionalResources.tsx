import Layout from "../layouts/application"
import { PageHeader, t } from "@bloom-housing/ui-components"

const Card = (props) => {
  return (
    <div className="info-card bg-primary-lighter">
      <h4 className="info-card__title normal-case text-base tracking-normal">
        <a href={props.link} target="_blank">
          {props.title}
        </a>
      </h4>
      <div className="text-sm">{props.children}</div>
    </div>
  )
}

export default () => {
  const pageTitle = <>{t("pageTitle.additionalResources")}</>

  return (
    <Layout>
      <PageHeader inverse={true} subtitle={t("pageDescription.additionalResources")}>
        {pageTitle}
      </PageHeader>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1">
            <div className="content py-8 px-4">
              <section>
                <h2 className="text-caps-underline">{t("additionalResources.rentals")}</h2>
                <h3 className="text-base font-serif font-normal mb-6">
                  {t("additionalResources.rentalsDescription")}
                </h3>
                <ul className="flex-none md:flex mb-6">
                  <li className="flex-1 pr-4">
                    <Card
                      title={t("additionalResources.card.SMCHousingSearch.title")}
                      link={t("additionalResources.card.SMCHousingSearch.link")}
                    >
                      <p>{t("additionalResources.card.SMCHousingSearch.description")}</p>
                      <p>{t("additionalResources.card.SMCHousingSearch.region")}</p>
                    </Card>
                  </li>
                  <li className="flex-1">
                    <Card
                      title={t("additionalResources.card.HavenConnect.title")}
                      link={t("additionalResources.card.HavenConnect.link")}
                    >
                      <p>{t("additionalResources.card.HavenConnect.description")}</p>
                      <p>{t("additionalResources.card.HavenConnect.region")}</p>
                    </Card>
                  </li>
                </ul>
              </section>
              <section>
                <h2 className="text-caps-underline">{t("additionalResources.sharedHousing")}</h2>
                <h3 className="text-base font-serif font-normal mb-6">
                  {t("additionalResources.sharedHousingDescription")}
                </h3>
                <ul className="flex-none md:flex mb-6">
                  <li className="flex-1 md:w-1/2 md:flex-none">
                    <Card
                      title={t("additionalResources.card.HIPHousing.title")}
                      link={t("additionalResources.card.HIPHousing.link")}
                    >
                      <p>{t("additionalResources.card.HIPHousing.description")}</p>
                      <p>{t("additionalResources.card.HIPHousing.region")}</p>
                    </Card>
                  </li>
                </ul>
              </section>
              <section>
                <h2 className="text-caps-underline">{t("additionalResources.otherResources")}</h2>
                <h3 className="text-base font-serif font-normal mb-6">
                  {t("additionalResources.otherResourcesDescription1")}.
                  {t("additionalResources.otherResourcesDescription2")}
                </h3>
                <ul className="flex-none md:flex">
                  <li className="flex-1">
                    <Card
                      title={t("additionalResources.card.HAotCoSM.title")}
                      link={t("additionalResources.card.HAotCoSM.link")}
                    >
                      <p>{t("additionalResources.card.HAotCoSM.description")}</p>
                      <p>{t("additionalResources.card.HAotCoSM.region")}</p>
                    </Card>
                  </li>
                  <li className="flex-1">
                    <Card
                      title={t("additionalResources.card.CIH.title")}
                      link={t("additionalResources.card.CIH.link")}
                    >
                      <p>{t("additionalResources.card.CIH.description")}</p>
                      <p>{t("additionalResources.card.CIH.region")}</p>
                    </Card>
                  </li>
                </ul>
                <ul className="flex-none md:flex">
                  <li className="flex-1">
                    <Card
                      title={t("additionalResources.card.211bayarea.title")}
                      link={t("additionalResources.card.211bayarea.link")}
                    >
                      <p>{t("additionalResources.card.211bayarea.description")}</p>
                      <p>{t("additionalResources.card.211bayarea.region")}</p>
                    </Card>
                  </li>
                  <li className="flex-1">
                    <Card
                      title={t("additionalResources.card.ProjectSentinel.title")}
                      link={t("additionalResources.card.ProjectSentinel.link")}
                    >
                      <p>{t("additionalResources.card.ProjectSentinel.description")}</p>
                      <p>{t("additionalResources.card.ProjectSentinel.region")}</p>
                    </Card>
                  </li>
                </ul>
              </section>
            </div>
          </div>
          <aside className="sidebar flex flex-col w-full p-8 md:w-1/3">
            <div>
              <h2 className="text-caps-underline">{t("additionalResources.contact")}</h2>
              <h3 className="text-base font-sans mb-4 font-bold">
                {t("additionalResources.forQuestions")}
              </h3>
              <h3 className="text-base font-sans">{t("additionalResources.SMCDOH")}</h3>
              <a href={"mailto:" + t("additionalResources.smchousingEmail")}>
                {t("additionalResources.smchousingEmail")}
              </a>
              <h3 className="text-base font-sans mt-4">{t("additionalResources.FCCD")}</h3>
              <a href={"mailto:" + t("additionalResources.FCCDEmail")}>
                {t("additionalResources.FCCDEmail")}
              </a>
              <p className="text-sm">{t("additionalResources.forGeneralInquiries")}</p>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  )
}
