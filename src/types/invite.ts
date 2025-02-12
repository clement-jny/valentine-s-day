export type TInvite = {
  uuid: number;
  userId: number;
  ref: string;
  name: string;
  message: string;
  response?: string;
  accessLink: string;
  status: StatusEnum;
  createdAt: Date;
};

enum StatusEnum {
  NOT_OPEN,
  OPEN,
  COMPLETED,
}
