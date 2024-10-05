import mongoose, {Model} from 'mongoose';

export interface UserFields {
  username: string;
  password: string;
  displayName: string;
  token: string;
}

export interface MessageFields {
  user: mongoose.Types.ObjectId;
  message: string;
  datetime: Date;
}

export interface IncomingMessage {
  type: string;
  payload: string;
}

export interface OnlineUser {
  _id: string;
  displayName: string;
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;