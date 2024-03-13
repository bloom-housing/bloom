import { IdDTO } from '../dtos/shared/id.dto';
import { User } from '../dtos/users/user.dto';

/*
    This maps a user that has requested changes on a listing to a limited IdDTO 
    This is used by the partner site front end
  */
export function requestedChangesUserMapper(user: User): IdDTO {
  return {
    id: user?.id,
    name:
      user?.firstName && user?.lastName
        ? user?.firstName + ' ' + user?.lastName
        : undefined,
  };
}
