import React, {useState} from 'react';
import {Button, Grid, Menu, MenuItem, Typography} from '@mui/material';
import {User} from '../../types';
import PortraitIcon from '@mui/icons-material/Portrait';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import {useAppDispatch} from '../../app/hooks';
import {logout} from '../../features/users/usersThunks';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Grid item>
      <Button sx={{display: 'flex', alignItems: 'center'}} onClick={handleClick}>
        <Typography color="#fff" variant="body2">Привет, {user.displayName}!</Typography>
        <KeyboardArrowDownIcon sx={{color: '#fff'}}/>
      </Button>

      <Menu open={isOpen} anchorEl={anchorEl} onClose={handleClose} keepMounted>
        <MenuItem><PortraitIcon/>&nbsp;{user.username}</MenuItem>
        <hr/>
        <MenuItem onClick={handleLogout}><LogoutIcon/>&nbsp;Выйти</MenuItem>
      </Menu>
    </Grid>
  );
};

export default UserMenu;