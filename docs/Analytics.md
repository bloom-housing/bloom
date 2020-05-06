# Setting up User Analytics

User Analytics within the Bloom reference apps is handled by Google Analytics (GA). In order to support additional analytics or tag integrations in the future, the default implementation is to use Google Tag Manager (GTM) from the reference code, which is then set up to call GA from within the GTM console.

## GA and GTM Console Setup

A basic setup can be accomplished by:

1. Setting up a new Property in the GA console for each new app to be deployed

2. Setting up a new matching Container in the GTM console

3. Creating a GA tag in the new GTM container that is linked to the GA property with the correct GA tag

4. Setting up triggers on the GA tag in GTM for both Page Views and History Changes.
    * NOTE: without the History Change trigger set up, only some pages will be captured, since react / next.js do not do a full page load to trigger the GTM page view event in all cases.

5. Setting up GTM and GA events for any external links that need to be tracked, e.g. the download of a PDF application or referral to an external website.

## GTM Tag Setup in Environment Variables / Code 

Once all of the GTM and GA provisioning and configuration has been completed, the code-side changes should be as simple as setting the GTM_KEY environment variable to the key from the container created above. This should be set in .env for a local dev environment (see `.env.template`), or in netlify.toml for those apps being deployed via Netlify.

See `apps/public-reference/src/customScripts.ts` for use of the GTM_KEY, noting that translation to gtmKey in process.env is automatic.

## Netlify Analytics

As a complement to Google Analytics, we also recommend enabling analytics on the Netlify platform for apps that are deployed there. In addition to providing a point of comparison / validation for the GA data, it also tracks things like 404s or other HTTP errors that may prevent GA from loading in the first place.