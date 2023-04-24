import { notFoundError, paymentRequired } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';

async function checkDataForUser(userId: number): Promise<string> {
  const enrollmentExists = await hotelRepository.findEnrollmentAndTicket(userId);

  if (!enrollmentExists || !enrollmentExists.Ticket[0]) return 'notFoundError';

  const includesHotel = await hotelRepository.includesHotel(enrollmentExists.id);

  if (
    !includesHotel.TicketType.includesHotel ||
    includesHotel.TicketType.isRemote ||
    enrollmentExists.Ticket[0].status !== 'PAID'
  )
    return 'paymentRequired';
}
async function getAllHotels(userId: number) {
  const check = await checkDataForUser(userId);
  if (check === 'paymentRequired') throw paymentRequired();
  if (check === 'notFoundError') throw notFoundError();

  const hotelsList = await hotelRepository.findHotels();
  if (!hotelsList.length) throw notFoundError();
  return hotelsList;
}

async function getRooms(userId: number, hotelId: number) {
  const check = await checkDataForUser(userId);
  if (check === 'paymentRequired') throw paymentRequired();
  if (check === 'notFoundError') throw notFoundError();

  const hotel = await hotelRepository.findHotelById(hotelId);
  if (!hotel.Rooms.length) throw notFoundError();
  return hotel;
}

const hotelService = {
  getAllHotels,
  getRooms,
};

export { hotelService };
