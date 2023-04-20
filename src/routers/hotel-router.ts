import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotels } from '@/controllers/hotels-controllers';

const hotelRouter = Router();
hotelRouter.all('/*', authenticateToken).get('/', getAllHotels);

export { hotelRouter };
