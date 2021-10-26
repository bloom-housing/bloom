import * as React from "react"

import { SiteHeader } from "./SiteHeader"

export default {
  title: "Headers/Site Header",
}

export const basic = () => (
  <SiteHeader
    homeURL={"/"}
    // languages={[{ label: "English", onClick: () => console.log("Clicked English"), active: true }]}
    logoSrc="/images/logo_glyph.svg"
    // notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
    title="Alameda County Housing Portal"
    menuLinks={[]}
  />
)

export const withNotice = () => (
  <SiteHeader
    homeURL={"/"}
    logoSrc="/images/logo_glyph.svg"
    notice="This is a preview of our new website. We're just getting started. We'd love to get your feedback."
    title="Alameda County Housing Portal"
    menuLinks={[]}
  />
)

export const withLanguage = () => (
  <SiteHeader
    homeURL={"/"}
    languages={[
      { label: "English", onClick: () => console.log("Clicked English"), active: true },
      { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
      { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
    ]}
    logoSrc="/images/logo_glyph.svg"
    title="Alameda County Housing Portal"
    menuLinks={[]}
  />
)

export const withLanguageAndMobileNotice = () => (
  <SiteHeader
    homeURL={"/"}
    languages={[
      { label: "English", onClick: () => console.log("Clicked English"), active: true },
      { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
      { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
    ]}
    noticeMobile={true}
    notice="We're just getting started. We'd love to get your feedback."
    logoSrc="/images/logo_glyph.svg"
    title="Alameda County Housing Portal"
    menuLinks={[]}
  />
)

export const slimLogo = () => (
  <SiteHeader
    homeURL={"/"}
    languages={[
      { label: "English", onClick: () => console.log("Clicked English"), active: true },
      { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
      { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
    ]}
    logoWidth={"slim"}
    notice="We're just getting started. We'd love to get your feedback."
    logoSrc="/images/logo_glyph.svg"
    title="Housing Portal"
    menuLinks={[]}
  />
)

export const mediumLogo = () => (
  <SiteHeader
    homeURL={"/"}
    languages={[
      { label: "English", onClick: () => console.log("Clicked English"), active: true },
      { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
      { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
    ]}
    logoWidth={"medium"}
    notice="We're just getting started. We'd love to get your feedback."
    logoSrc="/images/logo_glyph.svg"
    title="Housing Portal"
    menuLinks={[]}
  />
)

export const wideLogo = () => (
  <SiteHeader
    homeURL={"/"}
    languages={[
      { label: "English", onClick: () => console.log("Clicked English"), active: true },
      { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
      { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
    ]}
    logoWidth={"wide"}
    notice="We're just getting started. We'd love to get your feedback."
    logoSrc="/images/logo_glyph.svg"
    title="Housing Portal"
    menuLinks={[]}
  />
)

export const withMenuLinks = () => (
  <SiteHeader
    homeURL={"/"}
    languages={[
      { label: "English", onClick: () => console.log("Clicked English"), active: true },
      { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
      { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
    ]}
    notice="We're just getting started. We'd love to get your feedback."
    logoSrc="/images/logo_glyph.svg"
    title="Alameda County Housing Portal"
    menuLinks={[
      {
        title: "Listings",
        href: "/",
      },
      {
        title: "Get Assistance",
        href: "/",
      },
      {
        title: "Sign In",
        href: "/",
      },
    ]}
  />
)

export const withMenuDropdowns = () => (
  <SiteHeader
    homeURL={"/"}
    languages={[
      { label: "English", onClick: () => console.log("Clicked English"), active: true },
      { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
      { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
    ]}
    notice="We're just getting started. We'd love to get your feedback."
    logoSrc="/images/logo_glyph.svg"
    title="Alameda County Housing Portal"
    menuLinks={[
      {
        title: "My Account",
        subMenuLinks: [
          {
            title: "My Dashboard",
            href: "/account/dashboard",
          },
          {
            title: "My Applications",
            href: "/account/dashboard",
          },
          {
            title: "Account Settings",
            href: "/account/edit",
          },
          {
            title: "Sign Out",
            onClick: () => {},
          },
        ],
      },
    ]}
  />
)

export const withMobileDrawer = () => (
  <SiteHeader
    homeURL={"/"}
    languages={[
      { label: "English", onClick: () => console.log("Clicked English"), active: true },
      { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
      { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
    ]}
    notice="We're just getting started. We'd love to get your feedback."
    logoSrc="/images/logo_glyph.svg"
    title="Alameda County Housing Portal"
    menuLinks={[
      {
        title: "Listings",
        href: "/",
      },
      {
        title: "Get Assistance",
        href: "/",
      },
      {
        title: "Sign In",
        href: "/",
      },
    ]}
    mobileDrawer={true}
  />
)

export const withMobileText = () => (
  <SiteHeader
    homeURL={"/"}
    languages={[
      { label: "English", onClick: () => console.log("Clicked English"), active: true },
      { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
      { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
    ]}
    mobileText={true}
    notice="We're just getting started. We'd love to get your feedback."
    logoSrc="/images/logo_glyph.svg"
    title="Alameda County Housing Portal"
    menuLinks={[
      {
        title: "Listings",
        href: "/",
      },
      {
        title: "Get Assistance",
        href: "/",
      },
      {
        title: "Sign In",
        href: "/",
      },
    ]}
    mobileDrawer={true}
  />
)

export const withNoticeOnMobile = () => (
  <SiteHeader
    homeURL={"/"}
    logoSrc="/images/logo_glyph.svg"
    notice="We'd love to get your feedback."
    title="Alameda County Housing Portal"
    menuLinks={[]}
    noticeMobile={true}
  />
)

export const withFlattenedMobileSubMenus = () => (
  <SiteHeader
    homeURL={"/"}
    languages={[
      { label: "English", onClick: () => console.log("Clicked English"), active: true },
      { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
      { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
    ]}
    flattenSubMenus={true}
    notice="We're just getting started. We'd love to get your feedback."
    logoSrc="/images/logo_glyph.svg"
    title="Alameda County Housing Portal"
    menuLinks={[
      {
        title: "My Account",
        subMenuLinks: [
          {
            title: "My Dashboard",
            href: "/account/dashboard",
          },
          {
            title: "My Applications",
            href: "/account/dashboard",
          },
          {
            title: "Account Settings",
            href: "/account/edit",
          },
          {
            title: "Sign Out",
            onClick: () => {},
          },
        ],
      },
    ]}
  />
)

export const withDropdownIcons = () => (
  <SiteHeader
    homeURL={"/"}
    languages={[
      { label: "English", onClick: () => console.log("Clicked English"), active: true },
      { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
      { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
    ]}
    notice="We're just getting started. We'd love to get your feedback."
    logoSrc="/images/logo_glyph.svg"
    title="Alameda County Housing Portal"
    dropdownItemClassName={"text-xs"}
    menuLinks={[
      {
        title: "My Account",
        subMenuLinks: [
          {
            title: "My Dashboard",
            href: "/account/dashboard",
            iconSrc: "https://bit.ly/2YoHrxA",
            iconClassName: "w-6 pr-2",
          },
          {
            title: "My Applications",
            href: "/account/dashboard",
            iconSrc: "https://bit.ly/2YoHrxA",
            iconClassName: "w-6 pr-2",
          },
          {
            title: "Account Settings",
            href: "/account/edit",
            iconSrc: "https://bit.ly/2YoHrxA",
            iconClassName: "w-6 pr-2",
          },
          {
            title: "Sign Out",
            onClick: () => {},
            iconSrc: "https://bit.ly/2YoHrxA",
            iconClassName: "w-6 pr-2",
          },
        ],
      },
    ]}
  />
)
export const imageOnlyLogo = () => (
  <SiteHeader
    homeURL={"/"}
    languages={[
      { label: "English", onClick: () => console.log("Clicked English"), active: true },
      { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
      { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
    ]}
    imageOnly
    logoWidth={"medium"}
    notice="We're just getting started. We'd love to get your feedback."
    logoSrc="https://bit.ly/3me4iUC"
    menuLinks={[]}
  />
)

export const DAHLIAToggleSet = () => (
  <SiteHeader
    homeURL={"/"}
    languages={[
      { label: "English", onClick: () => console.log("Clicked English"), active: true },
      { label: "Español", onClick: () => console.log("Clicked Español"), active: false },
      { label: "中文", onClick: () => console.log("Clicked 中文"), active: false },
    ]}
    notice="We'd love to get your feedback."
    noticeMobile={true}
    mobileDrawer={true}
    flattenSubMenus={true}
    imageOnly={true}
    mobileText={true}
    logoWidth={"medium"}
    logoSrc="https://bit.ly/3me4iUC"
    dropdownItemClassName={"text-xs"}
    menuLinks={[
      {
        title: "Some longer links",
        href: "/",
      },
      {
        title: "Some longer links",
        href: "/",
      },
      {
        title: "Some longer links",
        href: "/",
      },
      {
        title: "My Account",
        subMenuLinks: [
          {
            title: "My Dashboard",
            href: "/account/dashboard",
            iconSrc: "https://bit.ly/2YoHrxA",
            iconClassName: "w-6 pr-2",
          },
          {
            title: "My Applications",
            href: "/account/dashboard",
            iconSrc: "https://bit.ly/2YoHrxA",
            iconClassName: "w-6 pr-2",
          },
          {
            title: "Account Settings",
            href: "/account/edit",
            iconSrc: "https://bit.ly/2YoHrxA",
            iconClassName: "w-6 pr-2",
          },
          {
            title: "Sign Out",
            onClick: () => {},
            iconSrc: "https://bit.ly/2YoHrxA",
            iconClassName: "w-6 pr-2",
          },
        ],
      },
    ]}
  />
)
