// src/http/middlewares/auth.ts
import { Context, Next } from 'hono';
import { jwtVerify } from 'jose';

interface ContextVariableMap {
	user: {
		id: string;
		role: 'user' | 'admin';
	};
}

export async function authMiddleware(c: Context<{ Bindings: Env; Variables: ContextVariableMap }>, next: Next) {
	const authHeader = c.req.header('Authorization');

	if (!authHeader) {
		return c.json({ message: 'Unauthorized' }, 401);
	}

	const [type, token] = authHeader.split(' ');

	if (type !== 'Bearer' || !token) {
		return c.json({ message: 'Unauthorized' }, 401);
	}

	try {
		const secretKey = new TextEncoder().encode(c.env.JWT_SECRET);

		const { payload } = await jwtVerify(token, secretKey);

		const userId = payload.sub;

		if (!userId) {
			return c.json({ message: 'Unauthorized' }, 401);
		}

		c.set('user', {
			id: userId,
			role: payload.role as 'user' | 'admin',
		});

		await next();
	} catch {
		return c.json({ message: 'Unauthorized' }, 401);
	}
}
