import { Context } from 'hono';
import z, { uuid } from 'zod';
import { D1UsersRepository } from '../../../repository/users-repository';
import { SearchOrdersUseCase } from '../../../use-case/search-orders';
import { D1OrdersRepository } from '../../../repository/orders-repository';
import { updateOrdersUseCase } from '../../../use-case/update-order';
import { canceledOrdersUseCase } from '../../../use-case/canceled-order';

export async function canceled(c: Context<{ Bindings: Env }>) {
	const canceledOrderParamSchema = z.object({ orderId: uuid() });

	const canceledBodySchema = z.object({
		userId: z.string(),
	});

	const { orderId } = canceledOrderParamSchema.parse(c.req.param());
	const { userId } = canceledBodySchema.parse(await c.req.json());

	try {
		const userRepository = new D1UsersRepository(c.env.order_api);
		const orderRepository = new D1OrdersRepository(c.env.order_api);
		const useCase = new canceledOrdersUseCase(orderRepository, userRepository);

		const response = await useCase.execute({ userId, orderId });
		return c.json(response, 200);
	} catch (err) {
		throw err;
	}
}
