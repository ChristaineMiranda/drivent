import hotelRepository from '@/repositories/hotel-repository';
import { notFoundError, forbidden, unauthorizedError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';

async function checkDataForUser(userId: number): Promise<string> {
  const enrollmentExists = await hotelRepository.findEnrollmentAndTicket(userId);

  if (!enrollmentExists || !enrollmentExists.Ticket[0]) return 'notFoundError';

  const includesHotel = await hotelRepository.includesHotel(enrollmentExists.id);

  if (
    !includesHotel.TicketType.includesHotel ||
    includesHotel.TicketType.isRemote ||
    enrollmentExists.Ticket[0].status !== 'PAID'
  )
    return 'forbidden';
}

async function createBooking(userId: number, roomId: number) {
  const check = await checkDataForUser(userId);
  if (check === 'forbidden') throw forbidden();
  if (check === 'notFoundError') throw notFoundError();

  const roomExists = await hotelRepository.findRoomById(roomId);
  if (!roomExists) throw notFoundError();

  const bookingsForThisRoom = await bookingRepository.findbookingsForRoomId(roomId);

  if (roomExists.capacity <= bookingsForThisRoom.length) throw forbidden();

  const booking = await bookingRepository.createBooking(userId, roomId);
  return booking;
}

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBookingForUserId(userId);
  if (!booking) throw notFoundError();
  return booking;
}

async function updateBooking(roomId: number, bookingId: number) {
  const bookingExists = await bookingRepository.findBookingForId(bookingId);
  if (!bookingExists) throw forbidden();

  const roomWanted = await hotelRepository.findRoomById(roomId);
  if (!roomWanted) throw notFoundError();

  const bookingsForWantedRoom = await bookingRepository.findbookingsForRoomId(roomId);

  if (roomWanted.capacity <= bookingsForWantedRoom.length) throw forbidden();

  await bookingRepository.updateBooking(roomId, bookingId);
  return bookingExists.id;
}

export default {
  createBooking,
  getBooking,
  updateBooking,
};
