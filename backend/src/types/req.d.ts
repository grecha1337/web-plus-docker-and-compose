import { Request } from '@nestjs/common';
export interface RequestWithUser extends Request {
  user: {
    id: number;
    createdAt: string;
    updatedAt: string;
    username: string;
    about: string;
    avatar: string;
    email: string;
    password: string;
  };
}
