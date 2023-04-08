import { ApplicationError } from '@/protocols';

export function invalidCepFormat(): ApplicationError {
  return {
    name: 'InvalidCepFormat',
    message: 'Invalid search format!',
  };
}
