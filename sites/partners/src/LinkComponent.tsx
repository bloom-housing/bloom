import { PropsWithChildren } from "react"
import { LinkProps } from "@bloom-housing/ui-components"
import Link from "next/link"

const LinkComponent = (props: PropsWithChildren<LinkProps>) => {
  const anchorProps = { ...props }
  delete anchorProps.href

  /* eslint-disable jsx-a11y/anchor-has-content */
  return (
    <Link href={props.href}>
      <a {...anchorProps} />
    </Link>
  )
}

export default LinkComponent
