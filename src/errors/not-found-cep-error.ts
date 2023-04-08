import { ApplicationError } from '@/protocols';

export function notFoundCepError(): ApplicationError {
  return {
    name: 'NotFoundCepError',
    message: 'Adress not found',
  };
}
