import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketPayment, payTicket } from '@/controllers/payments-controller';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', getTicketPayment).post('/process', payTicket);

export { paymentsRouter };
