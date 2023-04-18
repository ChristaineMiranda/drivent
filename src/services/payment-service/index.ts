import { invalidOrNotSentId, notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';
import { CardData } from '@/protocols';

async function getTicketPayment(ticketId: number, userId: number) {
  if (!ticketId) {
    throw invalidOrNotSentId();
  }
  const ticketExists = await paymentRepository.getTicketById(ticketId);
  if (!ticketExists) {
    throw notFoundError();
  }
  if (ticketExists.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }
  const payment = await paymentRepository.getPayment(ticketId);
  return payment;
}

async function payTicket(ticketId: number, cardData: CardData, userId: number) {
  if (!ticketId || !cardData) {
    throw invalidOrNotSentId();
  }
  const ticketExists = await paymentRepository.getTicketById(ticketId);
  if (!ticketExists) {
    throw notFoundError();
  }
  if (ticketExists.Enrollment.userId !== userId) {
    throw unauthorizedError();
  }
  const price = ticketExists.TicketType.price;
  const cardLastDigits = cardData.number.toString().slice(-4);

  const data = { ticketId, value: price, cardIssuer: cardData.issuer, cardLastDigits };

  const payment = await paymentRepository.payTicket(data);
  await paymentRepository.setStatusTicket(ticketId);
  return payment;
}

const paymentService = {
  getTicketPayment,
  payTicket,
};
export default paymentService;
