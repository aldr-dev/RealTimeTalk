import {OnlineUser} from '../../../types';
import React from 'react';
import {Avatar, Box} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

interface Props {
  usersOnline: OnlineUser;
}

const UserItem: React.FC<Props> = ({usersOnline}) => {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 1.3, my: 1}}>
      <Avatar sx={{height: '28px', width: '28px'}}>{usersOnline.displayName.charAt(0)}</Avatar>
      {usersOnline.displayName}
      <CircleIcon sx={{color: '#08c54b', height: '10px', width: '10px'}}/>
    </Box>
  );
};

export default UserItem;