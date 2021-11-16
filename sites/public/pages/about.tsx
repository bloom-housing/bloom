import React from "react"
import { MarkdownSection, t, PageHeader, GridSection, GridCell } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"

export default function About() {
  return (
    <Layout>
      <PageHeader title={t("pageTitle.about")} inverse />
      <div className="max-w-5xl m-auto px-5">
        <p className="my-8">{t("about.body1")}</p>
        <p className="my-8">{t("about.body2")}</p>
        <p>{t("about.moreInfoContact")}</p>
      </div>
      <MarkdownSection fullwidth>
        <GridSection title={t("about.thankYouPartners")}>
          <GridCell>
            <img src={"images/about/cass.png"} alt="Cass Community Social Services logo" />
          </GridCell>
          <GridCell>
            <img src={"images/about/google.org.png"} alt="Google.org logo" />
          </GridCell>
          <GridCell>
            <img src={"images/about/cots.png"} alt="COTS logo" />
          </GridCell>
          <GridCell>
            <img
              src={"images/about/department-of-neighborhoods.jpg"}
              alt="Department of Neighborhoods logo"
            />
          </GridCell>
          <GridCell>
            <img
              src={"images/about/neighborhood-legal-services.jpg"}
              alt="Wayne County Neighborhood Legal Services logo"
            />
          </GridCell>
          <GridCell>
            <img
              src={"images/about/united-community-housing-coalition.png"}
              alt="United Community Housing Coalition logo"
            />
          </GridCell>
          <GridCell>
            <img
              src={"images/about/central-detroit-christian.png"}
              alt="Central Detroit Christian Community Development logo"
            />
          </GridCell>
          <GridCell>
            <img src={"images/about/exygy.png"} alt="Exygy logo" />
          </GridCell>
          <GridCell>
            <img src={"images/about/matrix-human-services.png"} alt="Matrix Human Services logo" />
          </GridCell>
          <GridCell>
            <img
              src={"images/about/detroit-disability-power.png"}
              alt="Detroit Disability Power logo"
            />
          </GridCell>
          <GridCell>
            <img
              src={"images/about/michigan-housing-council.png"}
              alt="Michigan Housing Council logo"
            />
          </GridCell>
          <GridCell>
            <img src={"images/about/u-snap-bac.png"} alt="U-SNAP-BAC logo" />
          </GridCell>
          <GridCell>
            <img
              src={"images/about/north-corktown-council.png"}
              alt="North Corktown Neighborhood Council logo"
            />
          </GridCell>
          <GridCell>
            <img src={"images/about/wayne-metro.jpg"} alt="Wayne Metro Community Corps logo" />
          </GridCell>
        </GridSection>
      </MarkdownSection>
    </Layout>
  )
}
