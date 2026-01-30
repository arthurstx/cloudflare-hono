import { Hono } from 'hono';
import { ZodError } from 'zod';

export const app = new Hono<{ Bindings: Env }>();

app.onError((err, c) => {
	if (err instanceof ZodError) {
		return c.json({ message: 'Validation Error', issues: err.issues }, 400);
	}
	if (c.env.NODE_ENV === 'dev') {
		console.error(err);
	}
	return c.json({ message: 'Internal Server Error' }, 500);
});

/*-------routes-------*/
app.get('/health', (c) => c.json({ status: 'ok' }));
