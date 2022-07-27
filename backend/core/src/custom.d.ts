// Augment the definition of the Express Request object to have a well-typed version of "our" User object.
// https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
declare global {
  declare module "express-serve-static-core" {
    export interface Request {
      user?: import("./auth/entities/user.entity").User
    }
  }
}
