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

app.use(cors(config.corsOptions));
app.use(express.json());
app.use('/users', usersRouter);

const router = express.Router();
const connectedClients: WebSocket[] = [];
const onlineUsers: OnlineUser[] = [];

router.ws('/chat', (ws, _) => {
  connectedClients.push(ws);

  let user: OnlineUser | null = null;

  ws.on('message', async (message) => {
    const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;

    if (decodedMessage.type === 'LOGIN') {
      const foundUser = await User.findOne<OnlineUser>({token: decodedMessage.payload}, 'displayName');

      if (!foundUser) return;

      const existingUser = onlineUsers.find((user) => user._id === foundUser._id.toString());
      user = foundUser;

      if (!existingUser) {
        onlineUsers.push(user);
      } else {
        return;
      }

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

      connectedClients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'NEW-USER',
              payload: {user},
            }),
          );
        }
      });
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