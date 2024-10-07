import express from 'express';
import cors from 'cors';
import config from './config';
import mongoose from 'mongoose';
import usersRouter from './routers/users';
import expressWs from 'express-ws';
import {IncomingMessage, OnlineUser} from './types';
import {WebSocket} from 'ws';
import User from './models/User';
import Message from './models/Message';

const app = express();
expressWs(app);
const port = 8000;

const router = express.Router();

app.use(cors(config.corsOptions));
app.use(express.json());
app.use('/users', usersRouter);
app.use(router);

const connectedClients: WebSocket[] = [];
const onlineUsers: OnlineUser[] = [];

const handleUserLogout = (ws: WebSocket, user: OnlineUser | null) => {
  if (!user) return;

  const index = onlineUsers.findIndex((userOnline) => userOnline._id === user._id);

  if (index !== -1) {
    onlineUsers.splice(index, 1);
  }

  connectedClients.forEach((client) => {
    client.send(
      JSON.stringify({
        type: 'USER_LOGOUT',
        payload: {onlineUsers},
      }),
    );
  });

  ws.close(1000, 'Пользователь вышел из системы');
};

router.ws('/chat', (ws, _) => {
  connectedClients.push(ws);

  let user: OnlineUser | null = null;

  ws.on('message', async (message) => {
    const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;

    if (decodedMessage.type === 'LOGIN') {
      const foundUser = await User.findOne<OnlineUser>({token: decodedMessage.payload}, 'displayName _id');

      if (!foundUser) return;

      const existingUser = onlineUsers.find((user) => user._id.toString() === foundUser._id.toString());
      user = foundUser;

      if (!existingUser) {
        onlineUsers.push(user);
      } else {
        return;
      }

      const existingUserIndex = onlineUsers.findIndex((userOnline) => userOnline._id.toString() === user?._id.toString());

      if (existingUserIndex === -1) {
        onlineUsers.push(user);
      }

      connectedClients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'NEW_USER',
            payload: {user},
          }),
        );
      });

      const messages = await Message.find({})
        .sort({datetime: -1})
        .limit(30)
        .populate('user', 'displayName');

      ws.send(
        JSON.stringify({
          type: 'LOGIN_SUCCESS',
          payload: {
            onlineUsers,
            messages,
          },
        }),
      );
    }

    if (decodedMessage.type === 'LOGIN_OUT') {
      handleUserLogout(ws, user);
    }

    if (decodedMessage.type === 'SEND_MESSAGE') {
      if (user) {
        const newMessage = new Message({
          user: user._id,
          message: decodedMessage.payload,
          datetime: new Date().toISOString(),
        });

        await newMessage.save();

        connectedClients.forEach((client) => {
          client.send(
            JSON.stringify({
              type: 'NEW_MESSAGE',
              payload: {
                message: {
                  _id: newMessage._id,
                  user: user,
                  message: newMessage.message,
                  datetime: newMessage.datetime,
                },
              },
            }),
          );
        });
      }
    }
  });

  ws.on('close', () => {
    handleUserLogout(ws, user);
    const index = connectedClients.indexOf(ws);

    if (index !== -1) {
      connectedClients.splice(index, 1);
    }
  });
});

const run = async () => {
  await mongoose.connect(config.database);

  app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);