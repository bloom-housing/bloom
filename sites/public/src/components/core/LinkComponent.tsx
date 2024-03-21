import React, { PropsWithChildren } from "react"
import Link from "next/link"

const LinkComponent = (props: PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => {
  const anchorProps = { ...props }
  delete anchorProps.href

  /* eslint-disable jsx-a11y/anchor-has-content */
  return <Link href={props.href} {...anchorProps}></Link>
}

export default LinkComponent
