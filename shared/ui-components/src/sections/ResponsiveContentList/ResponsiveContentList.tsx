import * as React from "react"
import MediaQuery from "react-responsive"
import {
  Accordion,
  AccordionItemState,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from "react-accessible-accordion"

const ResponsiveContentList = (props: any) => (
  <>
    <MediaQuery maxWidth={767}>
      <Accordion allowZeroExpanded allowMultipleExpanded>
        {props.children}
      </Accordion>
    </MediaQuery>
    <MediaQuery minWidth={768}>{props.children}</MediaQuery>
  </>
)

const ResponsiveContentItem = (props: any) => (
  <>
    <MediaQuery maxWidth={767}>
      <AccordionItem>
        <AccordionItemState>{({ expanded }) => props.children}</AccordionItemState>
      </AccordionItem>
    </MediaQuery>
    <MediaQuery minWidth={768}>{props.children}</MediaQuery>
  </>
)

const ResponsiveContentItemHeader = (props: any) => (
  <>
    <MediaQuery maxWidth={767}>
      <AccordionItemHeading aria-level={2}>
        <AccordionItemButton>
          <header className="text-blue-800 sm:text-sm pr-4 pb-8 pl-4 pt-0">
            {props.children}
            <img
              src={`/images/cheveron-${props.expanded ? "up" : "down"}.svg`}
              className="sm:hidden w-5 float-right"
            />
          </header>
        </AccordionItemButton>
      </AccordionItemHeading>
    </MediaQuery>
    <MediaQuery minWidth={768}>{props.children}</MediaQuery>
  </>
)

const ResponsiveContentItemBody = (props: any) => (
  <>
    <MediaQuery maxWidth={767}>
      <AccordionItemPanel>{props.children}</AccordionItemPanel>
    </MediaQuery>
    <MediaQuery minWidth={768}>{props.children}</MediaQuery>
  </>
)

export {
  ResponsiveContentList,
  ResponsiveContentItem,
  ResponsiveContentItemHeader,
  ResponsiveContentItemBody
}
