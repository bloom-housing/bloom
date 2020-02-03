/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
/* eslint-env es6 */

const https = require("https")
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

// Simplifed version of https://stackoverflow.com/a/50891354
function httpsPost({ body, ...options }) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        method: "POST",
        ...options
      },
      res => {
        const chunks = []
        res.on("data", data => chunks.push(data))
        res.on("end", () => {
          // resolve the promise
          resolve(Buffer.concat(chunks))
        })
      }
    )
    // reject the promise if there's an error
    req.on("error", reject)
    req.write(body)
    req.end()
  })
}

async function pingNetlify(buildHook) {
  const git = require("simple-git/promise")
  const statusSummary = await git(__dirname).status()

  const currentBranch = statusSummary.current

  await httpsPost({
    hostname: "api.netlify.com",
    path: `/build_hooks/${buildHook}?trigger_branch=${currentBranch}&trigger_title=Heroku+Review+App+Trigger`,
    body: `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`
  })

  console.log("Netlify ping completed.")
}

/*
HEROKU_APP_NAME: The name of the review app
HEROKU_BRANCH: The name of the remote branch the review app is tracking
HEROKU_PR_NUMBER: The GitHub Pull Request number if the review app is created automatically
*/

if (process.env.NETLIFY_BUILD_HOOK) {
  pingNetlify(process.env.NETLIFY_BUILD_HOOK)
}
