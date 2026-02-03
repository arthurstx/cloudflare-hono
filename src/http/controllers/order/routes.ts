import { Hono } from 'hono';
import { createOrder } from './create-order';
import { search } from './search';
import { fetchOrders } from './fetch-orders';
import { update } from './update';
import { canceled } from './canceled';
import { authMiddleware } from '../../../middlewares/auth';

export const orderRoutes = new Hono();

orderRoutes.post('/create-orders', authMiddleware, createOrder);
orderRoutes.get('/search-orders/:orderId', authMiddleware, search);
orderRoutes.get('/fetch-orders', authMiddleware, fetchOrders);
orderRoutes.patch('/update-orders/:orderId', authMiddleware, update);
orderRoutes.patch('/canceled-orders/:orderId', authMiddleware, canceled);
