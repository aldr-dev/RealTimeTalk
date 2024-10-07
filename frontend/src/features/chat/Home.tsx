import {useNavigate} from 'react-router-dom';
import {useAppSelector} from '../../app/hooks';
import {selectUser} from '../users/usersSlice';
import {useEffect, useRef, useState} from 'react';
import {DecodedMessage, Message, OnlineUser} from '../../types';

const Home = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const ws = useRef<WebSocket | null>(null);

  const [messagesData, setMessagesData] = useState<Message[]>([]);
  const [onlineUsersData, setOnlineUsersData] = useState<OnlineUser[]>([]);
  const [inputField, setInputField] = useState('');
  const countReconnect = useRef(0);

  const connectWebSocket = () => {
    ws.current = new WebSocket('ws://localhost:8000/chat');

    ws.current.onopen = () => {
      countReconnect.current = 0;
      ws.current?.send(
        JSON.stringify({
          type: 'LOGIN',
          payload: user?.token,
        }),
      );
    };

    ws.current.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data) as DecodedMessage;

      if (parsedMessage.type === 'LOGIN_SUCCESS') {
        setMessagesData(parsedMessage.payload.messages);
        setOnlineUsersData(parsedMessage.payload.onlineUsers);
      }

      if (parsedMessage.type === 'NEW_USER') {
        setOnlineUsersData((prevState) => [
          ...prevState,
          parsedMessage.payload.user,
        ]);
      }

      if (parsedMessage.type === 'USER_LOGOUT') {
        setOnlineUsersData(parsedMessage.payload.onlineUsers);
      }

      if (parsedMessage.type === 'NEW_MESSAGE') {
        setMessagesData((prevState) => [
          ...prevState,
          parsedMessage.payload.message,
        ]);
      }
    };

    ws.current.onclose = () => {
      webSocketReconnect();
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.current?.close();
    };
  };

  const webSocketReconnect = () => {
    if (countReconnect.current < 5) {
      setTimeout(() => {
        countReconnect.current += 1;
        connectWebSocket();
      }, 5000);
    } else {
      console.log('Вы достигли максимальное количество попыток соединения!');
    }
  };

  useEffect(() => {
    if (!user) {
      ws.current?.send(
        JSON.stringify({
          type: 'LOGIN_OUT',
        }),
      );
      navigate('/login');
    }

    connectWebSocket();

    return () => ws.current?.close();
  }, [user]);

  return (
    <div>
      Home
    </div>
  );
};

export default Home;