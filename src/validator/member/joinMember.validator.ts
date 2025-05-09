import { GraphQLError } from "graphql";
import Validator from "../validator";

export const validateJoinMember = (
  email: string,
  name: string | null,
  password: string,
  address: string
) => {
  Validator.validateEmail(email);
  Validator.validateMaxLength(name, 20, 'name', '이름');
  Validator.validatePassword(password);
  Validator.validateMaxLength(address, 100, 'address', '주소');
};