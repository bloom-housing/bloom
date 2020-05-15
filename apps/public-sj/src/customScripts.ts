export const headScript = () => {
  const gtmKey = process.env.gtmKey
  if (gtmKey) {
    return `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmKey}')
    `
  } else {
    return ""
  }
}

export const bodyTopTag = () => {
  const gtmKey = process.env.gtmKey
  if (gtmKey) {
    return `
    <noscript><iframe height="0" src="//www.googletagmanager.com/ns.html?id=${gtmKey}" style="display:none;visibility:hidden" width="0"></iframe></noscript>
  `
  } else {
    return ""
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const pageChangeHandler = (url: any) => {
  // Customize this if you need to do something on page changes
  // after the initial site load
}
/* eslint-enable @typescript-eslint/no-unused-vars */
/* eslint-enable @typescript-eslint/no-explicit-any */
