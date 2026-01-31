import { D1OrdersRepository } from '../repository/orders-repository';
import { D1UsersRepository } from '../repository/users-repository';
import { Order } from '../types/types';

interface updateOrdersUseCaseRequest {
	userId: string;
}

interface updateOrdersUseCaseResponse {
	orders: Order[];
}

export class updateOrdersUseCase {
	constructor(
		private ordersRepository: D1OrdersRepository,
		private usersRepository: D1UsersRepository,
	) {}

	async execute({ userId }: updateOrdersUseCaseRequest): Promise<updateOrdersUseCaseResponse> {
		const user = await this.usersRepository.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		const orders = await this.ordersRepository.findManyByUserId(userId);
		if (orders.length === 0) {
			throw new Error('Order not found');
		}

		return { orders };
	}
}
