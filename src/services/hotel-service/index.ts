import httpStatus = require('http-status');
import { notFoundError, paymentRequired } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';

async function getAllHotels(userId: number) {
  const enrollmentExists = await hotelRepository.findEnrollmentAndTicket(userId);

  if (!enrollmentExists || !enrollmentExists.Ticket) throw notFoundError();

  const includesHotel = await hotelRepository.includesHotel(enrollmentExists.id);

  if (
    !includesHotel.TicketType.includesHotel ||
    includesHotel.TicketType.isRemote ||
    enrollmentExists.Ticket[0].status !== 'PAID'
  )
    throw paymentRequired();

  // const hotelsList = await hotelRepository.findHotels();
  // return hotelsList;
}

const hotelService = {
  getAllHotels,
};

export { hotelService };
