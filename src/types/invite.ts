export type TInvite = {
  uuid: number;
  userId: number;
  ref: string;
  name: string;
  message: string;
  response?: string;
  accessLink: string;
  createdAt?: Date;
  updatedAt?: Date;
};
