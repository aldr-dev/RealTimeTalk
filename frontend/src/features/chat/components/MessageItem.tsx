import {Message} from '../../../types';
import React from 'react';
import {Avatar, Box, Typography} from '@mui/material';
import dayjs from 'dayjs';

interface Props {
  messageData: Message;
}

const MessageItem: React.FC<Props> = ({messageData}) => {
  return (
    <Box sx={{display: 'flex', gap: 1}}>
      <Avatar sx={{alignSelf: 'flex-end'}}>{messageData.user.displayName.charAt(0)}</Avatar>
      <Box sx={{
        width: '400px',
        backgroundColor: '#fff',
        boxShadow: 2,
        minHeight: '100px',
        borderRadius: '8px',
        padding: '13px'}}>
        <Typography variant="h6" sx={{mb: .5}}>{messageData.user.displayName}</Typography>
        <Typography variant="body2">{messageData.message}</Typography>
        <Typography sx={{display: 'flex', justifyContent: 'flex-end'}} variant="body2">{dayjs(messageData.datetime).format('HH:mm')}</Typography>
      </Box>
    </Box>
  );
};

export default MessageItem;