import { Context } from 'hono';
import z from 'zod';
import { CreateOrderUseCase } from '../../../use-case/create-order';
import { D1OrdersRepository } from '../../../repository/oders-repository';
import { D1OrderItemsRepository } from '../../../repository/order-items-repository';
import { D1ProductsRepository } from '../../../repository/product-repository';
import { D1UsersRepository } from '../../../repository/users-repository';

export async function createOrder(c: Context<{ Bindings: Env }>) {
	/*
	userId: string;
	products: Array<{
		productId: string;
		quantity: number;
	}>;
	orderDate?: Date;
    */

	const createOrderBodySchema = z.object({
		userId: z.uuid(),
		products: z.array(
			z.object({
				productId: z.uuid(),
				quantity: z.number().min(1),
			}),
		),
		orderDate: z.coerce.date().optional(),
	});

	const { userId, products, orderDate } = createOrderBodySchema.parse(await c.req.json());

	try {
		const userRepository = new D1UsersRepository(c.env.order_api);
		const productRepository = new D1ProductsRepository(c.env.order_api);
		const orderRepository = new D1OrdersRepository(c.env.order_api);
		const orderItemsRepository = new D1OrderItemsRepository(c.env.order_api);
		const useCase = new CreateOrderUseCase(c.env.order_api, userRepository, productRepository, orderRepository, orderItemsRepository);

		const response = await useCase.execute({ userId, products, orderDate });
		return c.json(response, 201);
	} catch (err) {
		throw err;
	}
}
