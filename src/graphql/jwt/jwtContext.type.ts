import { StringValue } from 'ms';

export type jwtContext = {
  JWT_SECRET: string;
  JWT_EXPIRATION: StringValue;
};
