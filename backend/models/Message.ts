import mongoose, {Schema, Types} from 'mongoose';
import User from './User';
import {MessageFields} from '../types';

const MessageSchema = new mongoose.Schema<MessageFields>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const user = await User.findById(value);
        return Boolean(user);
      },
      message: 'User does not exist!',
    }
  },
  message: {
    type: String,
    required: [true, 'The body of the letter must be present!'],
  },
  datetime: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', MessageSchema);
export default Message;