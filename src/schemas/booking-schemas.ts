import Joi from 'joi';
import { InputRoomId } from '@/protocols';

export const bookingSchema = Joi.object<InputRoomId>({
  roomId: Joi.number().required(),
});
