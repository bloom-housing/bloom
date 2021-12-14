import { authzActions } from "../auth/enum/authz-actions.enum"

export const httpMethodsToAction = {
  PUT: authzActions.update,
  PATCH: authzActions.update,
  DELETE: authzActions.delete,
  POST: authzActions.create,
  GET: authzActions.read,
}
