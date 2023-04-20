import { notFoundError, paymentRequired } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';

async function checkDataForUser(userId: number) {
  const enrollmentExists = await hotelRepository.findEnrollmentAndTicket(userId);

  if (!enrollmentExists || !enrollmentExists.Ticket) throw notFoundError();

  const includesHotel = await hotelRepository.includesHotel(enrollmentExists.id);

  if (
    !includesHotel.TicketType.includesHotel ||
    includesHotel.TicketType.isRemote ||
    enrollmentExists.Ticket[0].status !== 'PAID'
  )
    throw paymentRequired();
}
async function getAllHotels(userId: number) {
  checkDataForUser(userId);
  const hotelsList = await hotelRepository.findHotels();
  return hotelsList;
}

async function getRooms(userId: number, hotelId: number) {
  checkDataForUser(userId);
  const hotel = hotelRepository.findHotelById(hotelId);
  if (!hotel) throw notFoundError();
  return hotel;
}

const hotelService = {
  getAllHotels,
  getRooms,
};

export { hotelService };
