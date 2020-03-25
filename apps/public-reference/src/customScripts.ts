export const headScript = () => {
  const gtmKey = "TEST"
  return `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    console.info("TESTING the GTM, very kewl!")
    })(window,document,'script','dataLayer','${gtmKey}')
  `
}

export const bodyTopTag = () => {
  const gtmKey = "TEST"
  return `
    <noscript><iframe height="0" src="//www.googletagmanager.com/ns.html?id=${gtmKey}" style="display:none;visibility:hidden" width="0"></iframe></noscript>
  `
}

export const pageChangeHandler = (url: any) => {
  // do something
}
