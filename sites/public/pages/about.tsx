import React from "react"
import { MarkdownSection, t, PageHeader, GridSection, GridCell } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import Layout from "../layouts/application"
import pageContent from "../page_content/about.md"

export default function About() {
  return (
    <Layout>
      <PageHeader title={t("pageTitle.about")} inverse />
      <MarkdownSection>
        <Markdown>{pageContent}</Markdown>
      </MarkdownSection>
      <MarkdownSection fullwidth>
        <GridSection title="Thank You to Our Partners">
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
