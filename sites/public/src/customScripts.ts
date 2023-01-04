export const gaLoadScript = () => {
  const gaKey = process.env.gaKey
  if (gaKey) {
    const script = document.createElement("script")
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaKey}`
    return script
  } else return null
}

export const gaCaptureScript = () => {
  const gaKey = process.env.gaKey
  if (gaKey) {
    const script = document.createElement("script")
    script.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaKey}');`
    return script
  } else return null
}

export const uaScript = () => {
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
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const pageChangeHandler = (url: any) => {
  // Customize this if you need to do something on page changes
  // after the initial site load
}
/* eslint-enable @typescript-eslint/no-unused-vars */
/* eslint-enable @typescript-eslint/no-explicit-any */
