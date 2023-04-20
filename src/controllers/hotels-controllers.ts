import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelService } from '@/services/hotel-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  try {
    const allHotels = await hotelService.getAllHotels(userId);
    return res.status(httpStatus.OK).send(allHotels);
  } catch (error) {
    next(error);
  }
}

export async function listRooms(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const hotelId = Number(req.params.hotelId);
  try {
    const roomsList = await hotelService.getRooms(userId, hotelId);
    return res.status(httpStatus.OK).send(roomsList);
  } catch (error) {
    next(error);
  }
}
