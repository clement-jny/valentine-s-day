import { type TInvitation } from './';

type TNewInvitationDTO = Pick<TInvitation, 'userId' | 'name' | 'message'> & {};

export type { TNewInvitationDTO };
