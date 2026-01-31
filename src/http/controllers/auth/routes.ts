import { Hono } from 'hono';
import { authenticate } from './auth';
import { register } from './register';

export const authRoutes = new Hono();

authRoutes.post('/register', register);
authRoutes.post('/authenticate', authenticate);
