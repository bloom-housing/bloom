import { permissionActions } from './permission-actions-enum';

export const httpMethodsToAction = {
  PUT: permissionActions.update,
  PATCH: permissionActions.update,
  DELETE: permissionActions.delete,
  POST: permissionActions.create,
  GET: permissionActions.read,
};
