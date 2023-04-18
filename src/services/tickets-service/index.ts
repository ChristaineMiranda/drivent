import { invalidOrNotSentId, notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function createTicket(userId: number, ticketTypeId: number) {
  if (!ticketTypeId || isNaN(ticketTypeId)) {
    throw invalidOrNotSentId();
  }
  const enrollmentExists = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentExists) {
    throw notFoundError();
  }

  const ticketCreated = await ticketsRepository.createTicket(ticketTypeId, enrollmentExists.id);
  return ticketCreated;
}

async function getTicketsTypes() {
  const result = await ticketsRepository.getTicketsTypes();
  return result;
}

async function getUserTickets(userId: number) {
  const enrollmentExists = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentExists) {
    throw notFoundError();
  }
  const result = await ticketsRepository.getUserTickets(enrollmentExists.id);
  if (!result) {
    throw notFoundError();
  }

  return result;
}

const ticketService = {
  createTicket,
  getTicketsTypes,
  getUserTickets,
};

export default ticketService;
