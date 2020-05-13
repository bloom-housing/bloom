import bodyParser from "body-parser"
import { Express, Request, Response, NextFunction } from "express"
import Provider from "oidc-provider"
import { authenticate } from "./users"

const parse = bodyParser.urlencoded({ extended: false })

export default (app: Express, provider: Provider) => {
  function setNoCache(req: Request, res: Response, next: NextFunction) {
    res.set("Pragma", "no-cache")
    res.set("Cache-Control", "no-cache, no-store")
    next()
  }

  app.get("/interaction/:uid", setNoCache, async (req, res, next) => {
    try {
      const details = await provider.interactionDetails(req, res)
      const { uid, prompt, params } = details

      const client = await provider.Client.find(params.client_id)

      if (prompt.name === "login") {
        // If we have non first-party apps (or apps with more restricted access), we may want to render an authorize
        // page after the initial login. For first party apps/for now, take care of the grants automatically and just
        // require the login.
        return res.render("login", {
          client,
          uid,
          details: prompt.details,
          params,
          title: "Sign-in",
          flash: undefined
        })
      }

      throw new Error(`Unhandled prompt type name '${prompt.name}'.`)
    } catch (err) {
      return next(err)
    }
  })

  app.post("/interaction/:uid/login", setNoCache, parse, async (req, res, next) => {
    try {
      const { uid, prompt, params } = await provider.interactionDetails(req, res)
      const client = await provider.Client.find(params.client_id)

      const accountId = await authenticate(req.body.email, req.body.password)

      if (!accountId) {
        res.render("login", {
          client,
          uid,
          details: prompt.details,
          params: {
            ...params,
            // eslint-disable-next-line @typescript-eslint/camelcase
            login_hint: req.body.email
          },
          title: "Sign-in",
          flash: "Invalid email or password."
        })
        return
      }

      const result = {
        login: {
          account: accountId
          // Configure 'remember' for persistent cookie vs. session based
        },
        // If we have non first-party apps (or apps with more restricted access), we may want to render an authorize
        // page after the initial login. For first party apps/for now, take care of the grants automatically and just
        // require the login ("implied consent")
        consent: {}
      }

      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false })
    } catch (err) {
      next(err)
    }
  })

  app.post("/interaction/:uid/confirm", setNoCache, parse, async (req, res, next) => {
    try {
      const result = {
        consent: {
          // rejectedScopes: [], // < uncomment and add rejections here
          // rejectedClaims: [], // < uncomment and add rejections here
        }
      }
      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: true })
    } catch (err) {
      next(err)
    }
  })

  app.get("/interaction/:uid/abort", setNoCache, async (req, res, next) => {
    try {
      const result = {
        error: "access_denied",
        // eslint-disable-next-line @typescript-eslint/camelcase
        error_description: "End-User aborted interaction"
      }
      await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false })
    } catch (err) {
      next(err)
    }
  })
}
