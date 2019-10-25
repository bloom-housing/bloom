import * as React from "react"

const WaitlistItem = (props: any) => (
  <li className={"uppercase text-gray-800 text-tiny " + props.class_name}>
    <span className="text-right w-12 inline-block pr-2">{props.value}</span>
    <span>{props.text}</span>
  </li>
)

const Waitlist = (props: any) => {
  const listing = props.listing
  const waitlistOpen = listing.waitlistCurrentSize < listing.waitlistMaxSize
  const header = waitlistOpen ? "Waitlist open" : "Waitlist closed"
  let availableUnitsInfo

  if (listing.unitsAvailable == 0) {
    availableUnitsInfo = (
      <p className="text-sm italic text-gray-700 pb-3">
        There are no available units at this time.
      </p>
    )
  }

  return (
    <>
      <h4 className="text-caps-tiny">{header}</h4>
      <div>
        {availableUnitsInfo}
        <p className="text-tiny text-gray-800 pb-3">
          Submit an application for an open slot on the waitlist for {listing.buildingTotalUnits}{" "}
          units.
        </p>
        <ul>
          <WaitlistItem value={listing.waitlistCurrentSize} text={"current waitlist size"} />
          <WaitlistItem
            value={listing.waitlistMaxSize - listing.waitlistCurrentSize}
            text={"open waitlist slots"}
            class_name={"font-semibold"}
          />
          <WaitlistItem value={listing.waitlistMaxSize} text={"final waitlist size"} />
        </ul>
      </div>
    </>
  )
}

export default Waitlist
