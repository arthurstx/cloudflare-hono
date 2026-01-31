import { Context } from 'hono';
import { RegisterUseCase } from '../../../use-case/register';
import { D1UsersRepository } from '../../../repository/users-repository';
import z from 'zod';

export async function register(c: Context<{ Bindings: Env }>) {
	const registerBodySchema = z.object({
		email: z.email(),
		password: z.string().min(6),
	});

	const { email, password } = registerBodySchema.parse(await c.req.json());

	try {
		const usersRepository = new D1UsersRepository(c.env.order_api);
		const useCase = new RegisterUseCase(usersRepository);

		await useCase.execute({ email, password });
	} catch (err) {
		throw err;
	}
}
