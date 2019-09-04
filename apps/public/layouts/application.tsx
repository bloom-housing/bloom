import * as React from "react"
import t from "@dahlia/ui-components/src/helpers/translator"
import SiteHeader from "@dahlia/ui-components/src/headers/site_header"
import SiteFooter from "@dahlia/ui-components/src/footers/site_footer"

const Layout = props => (
  <div>
    <SiteHeader
      logoSrc="/static/images/logo_glyph.svg"
      notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
      title={t("NAV.SITE_TITLE")}
    />
    <main>{props.children}</main>
    <SiteFooter />
  </div>
)

export default Layout
