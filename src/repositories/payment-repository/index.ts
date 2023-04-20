import { newPayment } from '@/protocols';
import { prisma } from '@/config';

async function getTicketById(ticketId: number) {
  return await prisma.ticket.findFirst({
    where: { id: ticketId },
    include: {
      Enrollment: true,
      TicketType: true,
    },
  });
}

async function getPayment(ticketId: number) {
  return await prisma.payment.findFirst({
    where: { ticketId },
  });
}

async function payTicket(data: newPayment) {
  return prisma.payment.create({
    data: data,
  });
}

async function setStatusTicket(ticketId: number) {
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: 'PAID' },
  });
}

const paymentRepository = {
  getTicketById,
  getPayment,
  payTicket,
  setStatusTicket,
};
export default paymentRepository;
