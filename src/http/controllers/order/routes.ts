import { Hono } from 'hono';
import { createOrder } from './create-order';
import { search } from './search';
import { fetchOrders } from './fetch-orders';
import { update } from './update';
import { canceled } from './canceled';

export const orderRoutes = new Hono();

orderRoutes.post('/create-orders', createOrder);
orderRoutes.get('/search-orders/:orderId', search);
orderRoutes.get('/fetch-orders', fetchOrders);
orderRoutes.patch('/update-orders/:orderId', update);
orderRoutes.patch('/canceled-orders/:orderId', canceled);
