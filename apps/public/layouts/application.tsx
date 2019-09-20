import * as React from "react"
import t from "@bloom/ui-components/src/helpers/translator"
import SiteHeader from "@bloom/ui-components/src/headers/site_header"
import SiteFooter from "@bloom/ui-components/src/footers/site_footer"

const Layout = props => (
  <div>
    <SiteHeader
      logoSrc="/static/images/logo_glyph.svg"
      notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
      title={t("nav.site_title")}
    />
    <main>{props.children}</main>
    <SiteFooter />
  </div>
)

export default Layout
