import { Hono } from 'hono';
import { createOrder } from './create-order';

export const orderRoutes = new Hono();

orderRoutes.post('/create-orders', createOrder);
