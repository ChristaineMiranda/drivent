import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentService from '@/services/payment-service';
import { CardData } from '@/protocols';

export async function getTicketPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const ticket = req.query.ticketId;
  const ticketId = Number(ticket);
  const userId = req.userId;
  try {
    const result = await paymentService.getTicketPayment(ticketId, userId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
}

export async function payTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { ticketId, cardData } = req.body as { ticketId: number; cardData: CardData };
  const userId = req.userId;
  try {
    const result = await paymentService.payTicket(ticketId, cardData, userId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
}
