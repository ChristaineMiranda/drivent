import supertest from 'supertest';
import httpStatus from 'http-status';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createUser,
  createTicket,
  createTicketTypeIncludesHotel,
  createTicketTypeNoIncludesHotel,
  createEnrollmentWithAddress,
} from '../factories';
import { createHotel, createRoom } from '../factories/hotels-factory';
import { createBookingUntilCapacity, createBooking } from '../factories/bookings-factory';
import app, { init } from '@/app';
import { prisma } from '@/config';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /booking', () => {
  it('should respond with status 404 if enrollment no exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 if the ingress is of remote type or not include hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeNoIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();
    const room = await createRoom(hotel.id);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if ticket status is not PAID', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

  it('should respond with status 404 if room with provided identifier does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();
    const room = await createRoom(hotel.id);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 0 });
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 if room is crowded', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    await createBookingUntilCapacity(user.id, room.id);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

  it('should respond with status 200 if booking completed sucessfully', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();
    const room = await createRoom(hotel.id);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

    const bookingCreated = await prisma.booking.findFirst({
      where: { userId: user.id },
    });
    expect(response.body).toEqual({ bookingId: bookingCreated.id });
    expect(response.status).toEqual(httpStatus.OK);
  });
});

describe('GET /booking', () => {
  it('should respond with status 404 if user has no booking', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();
    await createRoom(hotel.id);
    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 200 and list the reservation if the user has a reservation', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const bookingCreated = await createBooking(user.id, room.id);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(response.body).toEqual({
      id: bookingCreated.id,
      Room: {
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        hotelId: room.hotelId,
        createdAt: room.createdAt.toISOString(),
        updatedAt: room.updatedAt.toISOString(),
      },
    });
    expect(response.status).toEqual(httpStatus.OK);
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 403 if identifier does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();
    const room = await createRoom(hotel.id);

    const response = await server.put(`/booking/0`).set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

  it('should respond with status 404 if booking id not sent', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    await createBooking(user.id, room.id);

    const response = await server.put(`/booking`).set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if room id does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    await createBooking(user.id, room.id);

    const response = await server.put(`/booking`).set('Authorization', `Bearer ${token}`).send({ roomId: 0 });
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if room is crowded', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const newRoom = await createRoom(hotel.id);
    const bookingCreated = await createBooking(user.id, room.id);
    await createBookingUntilCapacity(user.id, newRoom.id);

    const response = await server
      .put(`/booking/${bookingCreated.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId: newRoom.id });
    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

  it('should respond with status 200 if update completed sucessfully', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const newRoom = await createRoom(hotel.id);
    const bookingCreated = await createBooking(user.id, room.id);

    const response = await server
      .put(`/booking/${bookingCreated.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ roomId: newRoom.id });
    expect(response.body).toEqual({ bookingId: bookingCreated.id });
    expect(response.status).toEqual(httpStatus.OK);
  });
});
