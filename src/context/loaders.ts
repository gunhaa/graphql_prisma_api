import { orderItemsLoader } from '../graphql/orderItem/loader';
import { ordersLoader } from '../graphql/order/loader';

export const createLoaders = () => ({
  ordersLoader: ordersLoader(),
  orderItemsLoader: orderItemsLoader(),
});
