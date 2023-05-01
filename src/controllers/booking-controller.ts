import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/booking-service';

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const roomId: number = req.body.roomId;

  try {
    const booking = await bookingsService.createBooking(userId, roomId);
    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (error) {
    next(error);
  }
}

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  try {
    const booking = await bookingsService.getBooking(userId);
    return res.status(200).send(booking);
  } catch (error) {
    next(error);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const bookingId = Number(req.params.bookingId);
  const roomId: number = req.body.roomId;
  try {
    const bookingWithNewRoomId = await bookingsService.updateBooking(roomId, bookingId);
    return res.status(200).send({ bookingId: bookingWithNewRoomId });
  } catch (error) {
    next(error);
  }
}
