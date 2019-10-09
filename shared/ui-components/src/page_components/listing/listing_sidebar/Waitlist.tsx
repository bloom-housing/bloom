import * as React from "react"

const WaitlistItem = (props: any) => (
  <li className={"uppercase text-gray-800 text-sm " + props.class_name}>
    <span className="text-right w-12 inline-block pr-2">{props.value}</span>
    <span>{props.text}</span>
  </li>
)

const Waitlist = (props: any) => {
  const listing = props.listing
  const waitlistOpen = listing.waitlist_current_size < listing.waitlist_max_size
  const header = waitlistOpen ? "Waitlist open" : "Waitlist closed"
  let availableUnitsInfo

  if (listing.units_available == 0) {
    availableUnitsInfo = (
      <p className="text-sm italic text-gray-700 pb-3">
        There are no available units at this time.
      </p>
    )
  }

  return (
    <>
      <h4 className="font-alt-sans uppercase font-semibold text-gray-800 text-sm pb-3">{header}</h4>
      <div>
        {availableUnitsInfo}
        <p className="text-sm text-gray-700 pb-3">
          Submit an application for an open slot on the waitlist for {listing.building_total_units}{" "}
          units.
        </p>
        <ul>
          <WaitlistItem value={listing.waitlist_current_size} text={"current waitlist size"} />
          <WaitlistItem
            value={listing.waitlist_max_size - listing.waitlist_current_size}
            text={"open waitlist slots"}
            class_name={"font-semibold"}
          />
          <WaitlistItem value={listing.waitlist_max_size} text={"final waitlist size"} />
        </ul>
      </div>
    </>
  )
}

export default Waitlist
