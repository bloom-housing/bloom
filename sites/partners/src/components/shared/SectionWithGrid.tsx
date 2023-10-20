import React from "react"
import { Grid, Heading, HeadingGroup } from "@bloom-housing/ui-seeds"

interface SectionWithGridProps {
  heading: React.ReactNode
  subheading?: React.ReactNode
  inset?: boolean
  bypassGrid?: boolean
  children: React.ReactNode
}

const HeadingRow = ({ children }) => {
  return (
    <Grid.Row>
      <Grid.Cell>
        <Heading size="lg" priority={3} className="grid-section-row-heading">
          {children}
        </Heading>
      </Grid.Cell>
    </Grid.Row>
  )
}

const SectionWithGrid = (props: SectionWithGridProps) => {
  return (
    <section className="section-with-grid spacer-section">
      {props.subheading ? (
        <HeadingGroup size="xl" heading={props.heading} subheading={props.subheading} />
      ) : (
        <Heading className="spacer-content" size="xl" priority={2}>
          {props.heading}
        </Heading>
      )}

      {props.bypassGrid ? (
        <div className={props.inset ? "grid-inset-section" : "spacer-section-above"}>
          {props.children}
        </div>
      ) : (
        <Grid spacing="lg" className={props.inset ? "grid-inset-section" : "spacer-section-above"}>
          {props.children}
        </Grid>
      )}
    </section>
  )
}

SectionWithGrid.HeadingRow = HeadingRow

export default SectionWithGrid
