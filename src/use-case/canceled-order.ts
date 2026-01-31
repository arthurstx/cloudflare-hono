import { D1OrdersRepository } from '../repository/orders-repository';
import { D1UsersRepository } from '../repository/users-repository';

interface canceledOrdersUseCaseRequest {
	userId: string;
	orderId: string;
}

export class canceledOrdersUseCase {
	constructor(
		private ordersRepository: D1OrdersRepository,
		private usersRepository: D1UsersRepository,
	) {}

	async execute({ userId, orderId }: canceledOrdersUseCaseRequest) {
		const user = await this.usersRepository.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		const orders = await this.ordersRepository.canceledOrder(orderId, userId);

		if (!orders.meta.changed_db) {
			throw new Error('Order not found');
		}

		return { orders };
	}
}
