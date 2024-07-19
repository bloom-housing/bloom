export const gaLoadScript = () => {
  const gaKey = process.env.gtmKey
  if (gaKey) {
    const script = document.createElement("script")
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaKey}`
    return script
  } else return null
}

export const gaCaptureScript = () => {
  const gaKey = process.env.gtmKey
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

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const pageChangeHandler = (url: any) => {
  // Customize this if you need to do something on page changes
  // after the initial site load
}
/* eslint-enable @typescript-eslint/no-unused-vars */
/* eslint-enable @typescript-eslint/no-explicit-any */
