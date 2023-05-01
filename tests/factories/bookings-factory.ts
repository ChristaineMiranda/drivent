import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}

export async function createBookingUntilCapacity(userId: number, roomId: number) {
  return prisma.booking.createMany({
    data: [
      {
        userId: userId,
        roomId: roomId,
      },
      {
        userId: userId,
        roomId: roomId,
      },
    ],
  });
}
