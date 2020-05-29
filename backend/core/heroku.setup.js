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
        ...options,
      },
      (res) => {
        const chunks = []
        res.on("data", (data) => chunks.push(data))
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

// Currently not used in the Heroku Review App process
// …but it might come in handy later
async function getBranchNameFromGit() {
  const git = require("simple-git/promise")
  const statusSummary = await git(__dirname).status()

  return statusSummary.current
}

function getBranchNameFromHerokuEnvVar() {
  return process.env.HEROKU_BRANCH
}

// Heroku Review app subdomains are randomized, so we need to
// extrapolate it from the env var provided
function determineHerokuListingServiceUrl() {
  return `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`
}

// Run the build hook on Netlify to generate a review app for the branch
async function pingNetlify(buildHook, currentBranch) {
  await httpsPost({
    hostname: "api.netlify.com",
    path: `/build_hooks/${buildHook}?trigger_branch=${currentBranch}&trigger_title=Heroku+Review+App+Trigger`,
    body: determineHerokuListingServiceUrl(),
  })

  console.log("Netlify ping completed.")
}

// ** Main Process **
if (process.env.NETLIFY_BUILD_HOOK) {
  pingNetlify(process.env.NETLIFY_BUILD_HOOK, getBranchNameFromHerokuEnvVar())
}
