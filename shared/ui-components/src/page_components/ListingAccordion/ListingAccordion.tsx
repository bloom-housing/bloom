import * as React from "react"
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from "react-accessible-accordion"
import { ContentSection } from "../../sections/content_section"
import { ListSection } from "../../sections/list_section"
import { InfoCard } from "../../cards/info_card"
import { Description } from "@dahlia/ui-components/src/atoms/description"

import { Listing } from "@dahlia/ui-components/src/types"

interface ListingAccordionProps {
  listing: Listing
}

const ListingAccordion = (props: ListingAccordionProps) => {
  const listing = props.listing

  return (
    <Accordion allowZeroExpanded allowMultipleExpanded preExpanded={["eligibility"]}>
      <AccordionItem uuid="eligibility">
        {/* TODO: make it work with types to add aria-level attr to accordion item heading */}
        <AccordionItemHeading>
          <AccordionItemButton>
            <header className="text-black text-base pr-4 pb-8 pl-4 pt-0">
              <img
                alt="eligibility-notebook"
                className="sm:hidden w-12"
                src="/static/images/listing-eligibility.svg"
              />
              <hgroup className="listing-header_group">
                <h3 className="listing-header_name">Eligibility</h3>
                <span className="listing-header_subheader">
                  Income, occupancy, preferences, and subsidies
                </span>
              </hgroup>
            </header>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <ContentSection>
            <ul>
              <ListSection
                title="Household Maximum Income"
                subtitle="For income calculations, household size includes everyone (all ages) living in the unit."
              >
                <>table goes here…</>
              </ListSection>

              <ListSection
                title="Occupancy"
                subtitle="Occupancy limits for this building differ from household size, and do not include children under 6."
              >
                <>table goes here…</>
              </ListSection>

              <ListSection
                title="Rental Assistance"
                subtitle="Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be
                      considered for this property. In the case of a valid rental subsidy, the required minimum income
                      will be based on the portion of the rent that the tenant pays after use of the subsidy."
              />

              <ListSection
                title="Housing Preferences"
                subtitle="Preference holders will be given highest ranking."
              >
                <>table goes here…</>
              </ListSection>

              <ListSection
                title="Additional Eligibility Rules"
                subtitle="Applicants must also qualify under the rules of the building."
              >
                <>
                  <InfoCard title="Credit History">
                    <p className="text-sm text-gray-700">{listing.credit_history}</p>
                  </InfoCard>
                  <InfoCard title="Rental History">
                    <p className="text-sm text-gray-700">{listing.rental_history}</p>
                  </InfoCard>
                </>
              </ListSection>
            </ul>
          </ContentSection>
        </AccordionItemPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            <header className="text-black text-base pr-4 pb-8 pl-4 pt-0">
              <img
                alt="eligibility-notebook"
                className="sm:hidden w-12"
                src="/static/images/listing-eligibility.svg"
              />
              <hgroup className="listing-header_group">
                <h3 className="listing-header_name">Features</h3>
                <span className="listing-header_subheader">
                  Amenities, unit details and additional fees
                </span>
              </hgroup>
            </header>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <ContentSection>
            <dl>
              <Description term="Neighborhood" description={listing.neighborhood} />
              <Description term="Built" description={listing.year_built} />
              <Description term="Smoking Policy" description={listing.smoking_policy} />
              <Description term="Pets Policy" description={listing.pet_policy} />
              <Description term="Property Amenities" description={listing.amenities} />
            </dl>
          </ContentSection>
        </AccordionItemPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            <header className="text-black text-base pr-4 pb-8 pl-4 pt-0">
              <img
                alt="eligibility-notebook"
                className="sm:hidden w-12"
                src="/static/images/listing-eligibility.svg"
              />
              <hgroup className="listing-header_group">
                <h3 className="listing-header_name">Neighborhood</h3>
                <span className="listing-header_subheader">Location and transportation</span>
              </hgroup>
            </header>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <ContentSection>
            <p>Map goes here…</p>
          </ContentSection>
        </AccordionItemPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            <header className="text-black text-base pr-4 pb-8 pl-4 pt-0">
              <img
                alt="eligibility-notebook"
                className="sm:hidden w-12"
                src="/static/images/listing-eligibility.svg"
              />
              <hgroup className="listing-header_group">
                <h3 className="listing-header_name">Additional Information</h3>
                <span className="listing-header_subheader">
                  Required documents and selection criteria
                </span>
              </hgroup>
            </header>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <ContentSection>
            <InfoCard title="Required Documents">
              <p className="text-sm text-gray-700">{listing.required_documents}</p>
            </InfoCard>
          </ContentSection>
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default ListingAccordion
