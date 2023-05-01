import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas/booking-schemas';
import { createBooking, getBooking, updateBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();
bookingRouter
  .all('/*', authenticateToken)
  .post('/', validateBody(bookingSchema), createBooking)
  .get('/', getBooking)
  .put('/:bookingId', validateBody(bookingSchema), updateBooking);

export { bookingRouter };
