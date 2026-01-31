import { Hono } from 'hono';
import { createOrder } from './create-order';
import { search } from './search';
import { fetchOrders } from './fetch-orders';

export const orderRoutes = new Hono();

orderRoutes.post('/create-orders', createOrder);
orderRoutes.get('/search-orders/:orderId', search);
orderRoutes.get('/fetch-orders', fetchOrders);
orderRoutes.patch('/fetch-orders', fetchOrders);
