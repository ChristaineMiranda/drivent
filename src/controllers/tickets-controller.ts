import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketService from '@/services/tickets-service';

export async function createTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const { ticketTypeId } = req.body as { ticketTypeId: number };
  try {
    const ticketCreated = await ticketService.createTicket(userId, ticketTypeId);
    return res.status(httpStatus.OK).send(ticketCreated);
  } catch (error) {
    next(error);
  }
}

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const result = await ticketService.getTicketsTypes();
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;
  try {
    const result = await ticketService.getUserTickets(userId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
}
