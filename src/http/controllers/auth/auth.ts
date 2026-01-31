import { Context } from 'hono';
import { D1UsersRepository } from '../../../repository/users-repository';
import z from 'zod';
import { AuthenticateUseCase } from '../../../use-case/authenticate';

export async function authenticate(c: Context<{ Bindings: Env }>) {
	const authenticateBodySchema = z.object({
		email: z.email(),
		password: z.string().min(6),
	});

	const { email, password } = authenticateBodySchema.parse(await c.req.json());

	try {
		const usersRepository = new D1UsersRepository(c.env.order_api);
		const useCase = new AuthenticateUseCase(usersRepository);

		await useCase.execute({ email, password });
	} catch (err) {
		throw err;
	}
}
