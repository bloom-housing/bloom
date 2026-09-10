export type LogoContent = {
  logoSrc: string
  logoAltText?: string
  logoUrl?: string
}

export const getJurisdictionEyebrowImageContent = (): LogoContent => {
  return {
    logoSrc: "/images/mtc-abag-logo.png",
    logoAltText:
      "Association of Bay Area Governments - Metropolitan Transportation Commission Logo",
    logoUrl: "https://mtc.ca.gov/",
  }
}
