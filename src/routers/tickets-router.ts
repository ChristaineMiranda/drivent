import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicket, getTicketsTypes, getUserTickets } from '@/controllers';
import { ticketsSchema } from '@/schemas/ticket-schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .post('/', validateBody(ticketsSchema), createTicket)
  .get('/types', getTicketsTypes)
  .get('/', getUserTickets);

export { ticketsRouter };
