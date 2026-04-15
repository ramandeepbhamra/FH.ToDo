import { PagedAndSortedRequest } from '../../shared/models/paged-request.model';

export interface GetUsersInput extends PagedAndSortedRequest {
  isActive: boolean | null;
  email: string | null;
  name: string | null;
}
