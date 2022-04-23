import * as React from "react"

export interface WaitlistProps {
  waitlistMaxSize?: number | null
  waitlistCurrentSize?: number | null
  waitlistOpenSpots?: number | null
  strings: {
    sectionTitle: string
    currentSize?: string
    openSpots?: string
    finalSize?: string
    description?: string | React.ReactNode
  }
}

const WaitlistItem = (props: { className?: string; value: number; text: string }) => (
  <li className={`uppercase text-gray-800 font-bold font-alt-sans leading-7 ${props.className}`}>
    <span className="text-right w-12 inline-block pr-2.5 text-base">{props.value}</span>
    <span className={"text-sm"}>{props.text}</span>
  </li>
)

const Waitlist = ({
  waitlistMaxSize,
  waitlistCurrentSize,
  waitlistOpenSpots,
  strings,
}: WaitlistProps) => {
  return (
    <section className="aside-block is-tinted">
      <h4 className="text-caps-tiny">{strings.sectionTitle}</h4>
      <div>
        {strings.description && (
          <p className="text-tiny text-gray-800 pb-3">{strings.description}</p>
        )}
        <ul>
          {waitlistCurrentSize !== null &&
            waitlistCurrentSize !== undefined &&
            strings.currentSize && (
              <WaitlistItem value={waitlistCurrentSize} text={strings.currentSize} />
            )}
          {waitlistOpenSpots !== null && waitlistOpenSpots !== undefined && strings.openSpots && (
            <WaitlistItem
              value={waitlistOpenSpots}
              text={strings.openSpots}
              className={"font-semibold"}
            />
          )}
          {waitlistMaxSize != null && strings.finalSize && (
            <WaitlistItem value={waitlistMaxSize} text={strings.finalSize} />
          )}
        </ul>
      </div>
    </section>
  )
}

export { Waitlist as default, Waitlist }
