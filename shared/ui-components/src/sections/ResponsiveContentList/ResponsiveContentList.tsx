import * as React from "react"
import Media from "react-media"
import {
  Accordion,
  AccordionItemState,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from "react-accessible-accordion"

const initialState = {
  device: "mobile" // add your own guessing logic here, based on user-agent for example
}

const ResponsiveContentList = (props: any) => (
  <Media query="(max-width: 767px)" defaultMatches={initialState.device === "mobile"}>
    {matches =>
      matches ? (
        <Accordion allowZeroExpanded allowMultipleExpanded>
          {props.children}
        </Accordion>
      ) : (
        props.children
      )
    }
  </Media>
)

const ResponsiveContentItem = (props: any) => (
  <Media query="(max-width: 767px)" defaultMatches={initialState.device === "mobile"}>
    {matches =>
      matches ? (
        <AccordionItem>
          <AccordionItemState>{({ expanded }) => props.children}</AccordionItemState>
        </AccordionItem>
      ) : (
        props.children
      )
    }
  </Media>
)

const ResponsiveContentItemHeader = (props: any) => (
  <Media query="(max-width: 767px)" defaultMatches={initialState.device === "mobile"}>
    {matches =>
      matches ? (
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
      ) : (
        props.children
      )
    }
  </Media>
)

const ResponsiveContentItemBody = (props: any) => (
  <Media query="(max-width: 767px)" defaultMatches={initialState.device === "mobile"}>
    {matches =>
      matches ? <AccordionItemPanel>{props.children}</AccordionItemPanel> : props.children
    }
  </Media>
)

export {
  ResponsiveContentList,
  ResponsiveContentItem,
  ResponsiveContentItemHeader,
  ResponsiveContentItemBody
}
