import * as React from "react"

import { Header } from "@dahlia/ui-components/src/header/header"

export default (props) => {
  console.log(props)
  return (
    <>
      <Header />
      <div>{props.polyglot.t("hello")}</div>
    </>
  )
}
