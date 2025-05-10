import { OrderItemDto } from "src/graphql/orderItem/orderItem.dto";
import Validator from "../validator";

export const validatePlaceOrder = (
  email: string,
  address: string,
  orderItems: OrderItemDto[]
) => {
  Validator.validateEmail(email);
  Validator.validateMaxLength(address, 100, 'address', '주소');
  for(const orderItem of orderItems) {
    Validator.validateId(orderItem.itemId);
  }
};
