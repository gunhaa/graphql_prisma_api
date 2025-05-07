import { orderItemsLoader } from '../loaders/orderItemsLoader';
import { ordersLoader } from '../loaders/ordersLoader';

export const createLoaders = () => ({
    ordersLoader: ordersLoader(),
    orderItemsLoader: orderItemsLoader(),
});