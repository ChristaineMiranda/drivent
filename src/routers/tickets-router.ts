import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createTicket, getTicketsTypes, getUserTickets } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .post('/', createTicket)
  .get('/types', getTicketsTypes)
  .get('/', getUserTickets);

export { ticketsRouter };
