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

async function findHotels() {
  return await prisma.hotel.findMany();
}

async function findHotelById(id: number) {
  return await prisma.hotel.findFirst({
    where: { id },
    include: { Rooms: true },
  });
}
async function findRoomById(id: number) {
  return await prisma.room.findFirst({
    where: { id },
  });
}

const hotelRepository = {
  findEnrollmentAndTicket,
  includesHotel,
  findHotels,
  findHotelById,
  findRoomById,
};
export default hotelRepository;
