import { prisma } from '@/config';

async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}
async function findbookingsForRoomId(id: number) {
  return await prisma.booking.findMany({
    where: { roomId: id },
  });
}

async function findBookingForUserId(userId: number) {
  return await prisma.booking.findFirst({
    where: { userId },
    select: { id: true, Room: true },
  });
}

async function updateBooking(roomId: number, bookingId: number) {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { roomId },
  });
}
async function findBookingForId(bookingId: number) {
  return await prisma.booking.findFirst({
    where: { id: bookingId },
  });
}

export default {
  createBooking,
  findbookingsForRoomId,
  findBookingForUserId,
  updateBooking,
  findBookingForId,
};
