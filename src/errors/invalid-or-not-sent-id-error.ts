import { ApplicationError } from '@/protocols';

export function invalidOrNotSentId(): ApplicationError {
  return {
    name: 'InvalidOrNotSentId',
    message: 'Invalid or not sent id!',
  };
}
