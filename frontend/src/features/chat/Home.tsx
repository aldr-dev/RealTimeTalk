import {useNavigate} from 'react-router-dom';
import {useAppSelector} from '../../app/hooks';
import {selectUser} from '../users/usersSlice';
import React, {useEffect, useRef, useState} from 'react';
import {DecodedMessage, Message, OnlineUser, User} from '../../types';
import {Box, Grid, TextField} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import UserItem from './components/UserItem';

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

  const handleInputField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputField(event.target.value);
  };

  const submitFormHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (!ws.current) return;

    if (inputField.trim().length !== 0) {
      ws.current.send(
        JSON.stringify({
          type: 'SEND_MESSAGE',
          payload: inputField,
        }),
      );
      setInputField('');
    }
  };

  return (
    <Box sx={{display: 'flex', gap: 2, height: 'calc(100vh - 120px)', mb: 3}}>
      <fieldset style={{width: '400px', borderRadius: '5px', borderColor: '#eee'}}>
        <legend style={{fontWeight: 'bold'}}>Онлайн пользователи</legend>
        {onlineUsersData && onlineUsersData.map((user) => (
          <UserItem key={user._id} usersOnline={user} />
        ))}
      </fieldset>

      <fieldset style={{width: '100%', borderRadius: '5px', borderColor: '#eee'}}>
        <legend style={{fontWeight: 'bold'}}>Онлайн Чат</legend>
        <Box component="form" onSubmit={submitFormHandler}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={9}>
              <TextField
                required
                fullWidth
                variant="outlined"
                label="Введите сообщение"
                name="inputField"
                value={inputField}
                onChange={handleInputField}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <LoadingButton
                type="submit"
                disabled={inputField.trim().length === 0}
                loadingPosition="start"
                startIcon={<SendIcon/>}
                variant="contained"
                sx={{width: '100%', padding: '15px 0'}}>
                <span>Отправить</span>
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </fieldset>
    </Box>
  );
};

export default Home;