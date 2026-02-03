import { Context } from 'hono';
import { D1UsersRepository } from '../../../repository/users-repository';
import z from 'zod';
import { AuthenticateUseCase } from '../../../use-case/authenticate';
import { SignJWT } from 'jose';
import { setCookie } from 'hono/cookie';

export async function authenticate(c: Context<{ Bindings: Env }>) {
	const authenticateBodySchema = z.object({
		email: z.email(),
		password: z.string().min(6),
	});

	const { email, password } = authenticateBodySchema.parse(await c.req.json());

	const secreteKey = new TextEncoder().encode(c.env.JWT_SECRET);

	try {
		const usersRepository = new D1UsersRepository(c.env.order_api);
		//	const refreshRepository = new D1RefreshTokensRepository(c.env.order_api);
		const useCase = new AuthenticateUseCase(usersRepository /*refreshRepository*/);

		const { user } = await useCase.execute({ email, password });

		const token = await new SignJWT({ role: user.role })
			.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
			.setSubject(user.id)
			.setIssuedAt()
			.setExpirationTime('15m')
			.sign(secreteKey);

		const refresh_token = await new SignJWT({ role: user.role })
			.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
			.setSubject(user.id)
			.setIssuedAt()
			.setExpirationTime('7d')
			.sign(secreteKey);

		setCookie(c, 'refresh_token', refresh_token, {
			httpOnly: true,
			secure: true,
			sameSite: 'Lax',
		});

		return c.json({ token }, 200);
	} catch (err) {
		throw err;
	}
}
