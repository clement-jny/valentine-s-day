export type TInvite = {
  uuid: number;
  userId: number;
  ref: string;
  name: string;
  message: string;
  response?: string;
  accessLink: string;
  status: EStatus;
  createdAt: Date;
};

export enum EStatus {
  NOT_OPEN,
  OPEN,
  COMPLETED,
}
