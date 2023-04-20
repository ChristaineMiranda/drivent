import Joi from 'joi';
import { InputHotelId } from '@/protocols';

export const hotelId = Joi.object<InputHotelId>({
  hotelId: Joi.number().required(),
});
