import { type TNewInvitationDTO } from './';

type TUpdateInvitationDTO = Partial<Omit<TNewInvitationDTO, 'userId'>> & {};

export type { TUpdateInvitationDTO };
