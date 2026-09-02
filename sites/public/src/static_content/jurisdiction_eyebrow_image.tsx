export type LogoContent = {
  logoSrc: string
  logoAltText?: string
  logoUrl?: string
}

export const getJurisdictionEyebrowImageContent = (): LogoContent => {
  return {
    logoSrc: "",
    logoAltText: "",
    logoUrl: "",
  }
}
