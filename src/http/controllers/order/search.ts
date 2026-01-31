import { Context } from 'hono';
import z, { uuid } from 'zod';
import { D1UsersRepository } from '../../../repository/users-repository';
import { SearchOrdersUseCase } from '../../../use-case/search-orders';
import { D1OrdersRepository } from '../../../repository/orders-repository';

export async function search(c: Context<{ Bindings: Env }>) {
	const searcParamSchema = z.object({ orderId: uuid() });

	const searchBodySchema = z.object({
		userId: z.string(),
	});

	const { orderId } = searcParamSchema.parse(c.req.param());
	const { userId } = searchBodySchema.parse(await c.req.json());

	try {
		const userRepository = new D1UsersRepository(c.env.order_api);
		const orderRepository = new D1OrdersRepository(c.env.order_api);
		const useCase = new SearchOrdersUseCase(orderRepository, userRepository);

		const response = await useCase.execute({ userId, orderId });
		return c.json(response, 201);
	} catch (err) {
		throw err;
	}
}
