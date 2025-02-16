type TInvitation = {
  uuid: number;
  userId: number;
  ref: string;
  name: string;
  message: string;
  response?: string;
  accessLink: string;
  status: EInvitationStatus;
  createdAt: Date;
};

enum EInvitationStatus {
  NOT_OPEN,
  OPEN,
  COMPLETED,
  DELETED,
}

export type { TInvitation, EInvitationStatus };
