import React, {useState} from 'react';
import {Avatar, Box, Grid, TextField, Typography, Link, Alert} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LoginIcon from '@mui/icons-material/Login';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {selectLoginError, selectLoginLoading} from './usersSlice';
import {LoginMutation} from '../../types';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {login} from './usersThunks';
import {LoadingButton} from '@mui/lab';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loginLoader = useAppSelector(selectLoginLoading);
  const error = useAppSelector(selectLoginError);

  const [state, setState] = useState<LoginMutation>({
    username: '',
    password: '',
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (state.username.trim().length !== 0 && state.password.trim().length !== 0) {
        await dispatch(login(state)).unwrap();
        navigate('/');
      }
    } catch (error) {
      setState({
        username: '',
        password: '',
      });
      console.error('Произошла ошибка при попытке авторизации. Пожалуйста, попробуйте позже. ' + error);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          width: '400px',
        }}>
        <Avatar sx={{m: 1, bgcolor: '#1976d2', width: 56, height: 56}}>
          <LockOpenIcon fontSize="large"/>
        </Avatar>
        <Typography component="h1" color="#000" variant="h5" sx={{mb: 3}}>
          Авторизация
        </Typography>
        <Box component="form" onSubmit={submitFormHandler} sx={{width: '100%'}}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <TextField
                required
                fullWidth
                variant="outlined"
                label="Логин"
                name="username"
                autoComplete="current-username"
                value={state.username}
                onChange={inputChangeHandler}/>
            </Grid>
            <Grid item>
              <TextField
                required
                fullWidth
                variant="outlined"
                type="password"
                label="Пароль"
                name="password"
                autoComplete="current-password"
                value={state.password}
                onChange={inputChangeHandler}/>
            </Grid>
          </Grid>
          <LoadingButton
            type="submit"
            disabled={state.username.trim().length === 0 || state.password.trim().length === 0}
            loadingPosition="start"
            startIcon={<LoginIcon/>}
            loading={loginLoader}
            variant="contained"
            sx={{
              mt: 4,
              width: '100%',
              padding: '12px 0',
            }}>
            <span>Войти</span>
          </LoadingButton>
          <Link
            component={RouterLink}
            to="/register"
            variant="body2"
            sx={{
              display: 'inline-block',
              width: '100%',
              mt: 2,
              color: '#1976d2',
              textAlign: 'center',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}>
            Нет аккаунта? Зарегистрироваться
          </Link>
        </Box>
        {error && (
          <Alert severity="error" sx={{mt: 3, width: '100%'}}>
            {error.error}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default Login;