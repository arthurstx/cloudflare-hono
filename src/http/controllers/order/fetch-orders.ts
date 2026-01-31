import { Context } from 'hono';
import z from 'zod';
import { D1UsersRepository } from '../../../repository/users-repository';
import { FetchUserOrdersUseCase } from '../../../use-case/fetch-user-orders';
import { D1OrdersRepository } from '../../../repository/orders-repository';

export async function fetchOrders(c: Context<{ Bindings: Env }>) {
	const searchBodySchema = z.object({
		userId: z.string(),
	});

	const { userId } = searchBodySchema.parse(await c.req.json());

	try {
		const userRepository = new D1UsersRepository(c.env.order_api);
		const orderRepository = new D1OrdersRepository(c.env.order_api);
		const useCase = new FetchUserOrdersUseCase(orderRepository, userRepository);

		const response = await useCase.execute({ userId });
		return c.json(response, 201);
	} catch (err) {
		throw err;
	}
}
