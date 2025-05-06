import { ordersLoader } from '../loaders/ordersLoader';

export const createLoaders = () => ({
    ordersLoader: ordersLoader(),
});