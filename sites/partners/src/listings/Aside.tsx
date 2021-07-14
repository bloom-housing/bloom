import React, { useContext, useMemo } from "react"
import moment from "moment"
import {
  t,
  StatusAside,
  Button,
  GridCell,
  AppearanceStyleType,
  StatusMessages,
  LocalizedLink,
  LinkButton,
} from "@bloom-housing/ui-components"
import { ListingContext } from "./ListingContext"
import { ListingStatus } from "@bloom-housing/backend-core/types"

type AsideProps = {
  type: AsideType
  setStatus?: (status: ListingStatus) => void
}

type AsideType = "add" | "edit" | "details"

const Aside = ({ type, setStatus }: AsideProps) => {
  const listing = useContext(ListingContext)

  const listingId = listing?.id

  const recordUpdated = useMemo(() => {
    if (!listing) return null

    const momentDate = moment(listing.updatedAt)

    return momentDate.format("MMMM DD, YYYY")
  }, [listing])

  const actions = useMemo(() => {
    const elements = []

    const cancel = (
      <GridCell className="flex" key="btn-cancel">
        <LinkButton
          unstyled
          fullWidth
          className="bg-opacity-0"
          href={type === "add" ? "/" : `/listings/${listingId}`}
        >
          {t("t.cancel")}
        </LinkButton>
      </GridCell>
    )

    if (type === "details") {
      elements.push(
        <GridCell key="btn-submitNew">
          <LocalizedLink href={`/listings/${listingId}/edit`}>
            <Button styleType={AppearanceStyleType.primary} fullWidth onClick={() => false}>
              {t("t.edit")}
            </Button>
          </LocalizedLink>
        </GridCell>
      )
    }

    if (type === "add" || type === "edit") {
      elements.push(
        <GridCell key="btn-publish">
          <Button
            styleType={AppearanceStyleType.success}
            fullWidth
            onClick={() => setStatus(ListingStatus.active)}
          >
            {t("listings.actions.publish")}
          </Button>
        </GridCell>,
        <GridCell key="btn-draft">
          <Button fullWidth onClick={() => setStatus(ListingStatus.pending)}>
            {t("listings.actions.draft")}
          </Button>
        </GridCell>
      )
    }

    if (type === "details") {
      elements.push(
        <GridCell key="btn-preview">
          <a target="_blank" href={`${process.env.publicBaseUrl}/preview/listings/${listingId}`}>
            <Button fullWidth onClick={() => false}>
              {t("listings.actions.preview")}
            </Button>
          </a>
        </GridCell>
      )
    }

    if (type === "add" || type === "edit") {
      elements.push(cancel)
    }

    return elements
  }, [listingId, setStatus, type])

  return (
    <>
      <StatusAside columns={1} actions={actions}>
        {type === "edit" && <StatusMessages lastTimestamp={recordUpdated} />}
      </StatusAside>
    </>
  )
}

export default Aside
