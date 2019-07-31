import * as React from "react"

import { Header } from "@dahlia/ui-components/src/header/header"

export default (props) => {
  return (
    <>
      <Header />
      <div>{props.polyglot.t('WELCOME.TITLE')}</div>
    </>
  )
}
