import z from 'zod';
import { D1UsersRepository } from '../repository/users-repository';
import { RegisterUseCase } from '../use-case/register';

const registerBodySchema = z.object({
	email: z.email(),
	password: z.string().min(6),
});

export async function register(request: Request, env: Env): Promise<Response> {
	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ message: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}

	const { email, password } = registerBodySchema.parse(body);
	const usersRepository = new D1UsersRepository(env.order_api);
	const useCase = new RegisterUseCase(usersRepository);

	await useCase.execute({ email, password });

	return new Response(JSON.stringify({ message: 'User registered successfully' }), {
		status: 201,
		headers: { 'Content-Type': 'application/json' },
	});
}
