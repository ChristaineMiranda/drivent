import supertest from 'supertest';
import httpStatus from 'http-status';
import { TicketStatus } from '@prisma/client';
import { createHotel, createRoom } from '../factories/hotels-factory';
import {
  createUser,
  createTicket,
  createPayment,
  createTicketTypeIncludesHotel,
  createTicketTypeNoIncludesHotel,
  createEnrollmentWithAddress,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 404 if enrollment no exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createHotel();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 if the ingress is of remote type or not include hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeNoIncludesHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createPayment(ticket.id, ticketType.price);

    await createHotel();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 if ticket status is not PAID', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    await createHotel();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 200 and with hotels data', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createPayment(ticket.id, ticketType.price);

    const hotel = await createHotel();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual([
      {
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString(),
      },
    ]);
  });
});

describe('GET /hotels/:hotelId', () => {
  //espera um hotel id dos params
  it('should respond with status 404 if enrollment no exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createHotel();

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 if the ingress is of remote type or not include hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeNoIncludesHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createPayment(ticket.id, ticketType.price);

    await createHotel();

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 if ticket status is not PAID', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    await createHotel();
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 200 and with rooms data', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIncludesHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createPayment(ticket.id, ticketType.price);

    const hotel = await createHotel();
    const rooms = await createRoom(hotel.id);

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual({
      id: hotel.id,
      name: hotel.name,
      image: hotel.image,
      createdAt: hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString(),
      Rooms: [
        {
          id: rooms.id,
          name: rooms.name,
          capacity: rooms.capacity,
          hotelId: hotel.id,
          createdAt: rooms.createdAt.toISOString(),
          updatedAt: rooms.updatedAt.toISOString(),
        },
      ],
    });
  });
});
