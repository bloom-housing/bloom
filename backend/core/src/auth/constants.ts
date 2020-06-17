// Ensure that a secret key is defined if we're not in dev mode
if (process.env.NODE_ENV !== "development" && !process.env.APP_SECRET) {
  throw new Error("APP_SECRET not found! This is a required config variable in production.")
}

export const secretKey = process.env.APP_SECRET || "secretKey"
