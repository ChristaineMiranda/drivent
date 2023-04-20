import { prisma } from '@/config';

async function findEnrollmentAndTicket(userId: number) {
  return await prisma.enrollment.findFirst({
    where: { userId },
    include: { Ticket: true },
  });
}

async function includesHotel(enrollmentId: number) {
  return await prisma.ticket.findFirst({
    where: { enrollmentId },
    include: { TicketType: true },
  });
}

// async function findHotels() {

// }

const hotelRepository = {
  findEnrollmentAndTicket,
  includesHotel,
  // findHotels
};
export default hotelRepository;
