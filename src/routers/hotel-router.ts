import { Router } from 'express';
import { authenticateToken, validateParams } from '@/middlewares';
import { getAllHotels, listRooms } from '@/controllers/hotels-controllers';
import { hotelId } from '@/schemas';

const hotelRouter = Router();
hotelRouter.all('/*', authenticateToken).get('/', getAllHotels).get('/:hotelId', validateParams(hotelId), listRooms);

export { hotelRouter };
