export interface User {
  _id: string;
  username: string;
  displayName: string;
  token: string;
}

export interface OnlineUser {
  _id: string;
  displayName: string;
}

export interface IncomingLoginMessage {
  type: 'LOGIN_SUCCESS';
  payload: {
    onlineUsers: OnlineUser[];
    messages: Message[];
  };
}

export interface IncomingLogoutMessage {
  type: 'USER_LOGOUT';
  payload: {
    onlineUsers: OnlineUser[];
  };
}

export interface IncomingNewUser {
  type: 'NEW_USER';
  payload: {
    user: OnlineUser;
  };
}

export interface IncomingNewMessage {
  type: 'NEW_MESSAGE';
  payload: {
    message: Message;
  };
}

export type DecodedMessage = | IncomingLoginMessage | IncomingLogoutMessage | IncomingNewMessage | IncomingNewUser;

export interface Message {
  _id: string;
  user: OnlineUser;
  message: string;
  datetime: string;
}

export interface RegisterMutation {
  username: string;
  password: string;
  displayName: string;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}