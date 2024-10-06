import React, {useState} from 'react';
import {Avatar, Box, Grid, TextField, Typography, Link} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {selectRegisterError, selectRegisterLoading} from './usersSlice';
import {RegisterMutation} from '../../types';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {register} from './usersThunks';
import {LoadingButton} from '@mui/lab';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const registerLoader = useAppSelector(selectRegisterLoading);
  const error = useAppSelector(selectRegisterError);

  const [state, setState] = useState<RegisterMutation>({
    username: '',
    password: '',
    displayName: '',
  });

  const getFieldError = (fieldName: string) => {
    return error?.errors[fieldName]?.message;
  };

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
      if (state.username.trim().length !== 0 &&
        state.password.trim().length !== 0 &&
        state.displayName.trim().length !== 0
      ) {
        await dispatch(register(state)).unwrap();
        navigate('/');
      }
    } catch (error) {
      console.error('Произошла ошибка при попытке регистрации. Пожалуйста, попробуйте позже. ' + error);
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
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          width: '400px',
        }}>
        <Avatar sx={{m: 1, bgcolor: '#1976d2', width: 59, height: 56}}>
          <LockOutlinedIcon fontSize="large"/>
        </Avatar>
        <Typography component="h1" color="#000" variant="h5" sx={{mb: 3}}>
          Регистрация
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
                autoComplete="new-username"
                value={state.username}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('username'))}
                helperText={getFieldError('username')}/>
            </Grid>
            <Grid item>
              <TextField
                required
                fullWidth
                variant="outlined"
                type="password"
                label="Пароль"
                name="password"
                autoComplete="new-password"
                value={state.password}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('password'))}
                helperText={getFieldError('password')}/>
            </Grid>
            <Grid item>
              <TextField
                required
                fullWidth
                variant="outlined"
                label="Имя пользователя"
                name="displayName"
                autoComplete="new-displayName"
                value={state.displayName}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('displayName'))}
                helperText={getFieldError('displayName')}/>
            </Grid>
          </Grid>
          <LoadingButton
            type="submit"
            disabled={
              state.username.trim().length === 0 ||
              state.password.trim().length === 0 ||
              state.displayName.trim().length === 0
            }
            loadingPosition="start"
            startIcon={<PersonAddIcon/>}
            loading={registerLoader}
            variant="contained"
            sx={{
              mt: 4,
              width: '100%',
              padding: '12px 0',
            }}>
            <span>Регистрация</span>
          </LoadingButton>
          <Link
            component={RouterLink}
            to="/login"
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
            Уже есть аккаунт? Войти
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;