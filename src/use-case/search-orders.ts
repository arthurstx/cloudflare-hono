import { D1OrdersRepository } from '../repository/oders-repository';
import { D1UsersRepository } from '../repository/users-repository';
import { Order } from '../types/types';

interface SearchOrdersUseCaseRequest {
	userId: string;
	orderId: string;
}

interface SearchOrdersUseCaseResponse {
	order: Order;
}

export class SearchOrdersUseCase {
	constructor(
		private ordersRepository: D1OrdersRepository,
		private usersRepository: D1UsersRepository,
	) {}

	async execute({ userId, orderId }: SearchOrdersUseCaseRequest): Promise<SearchOrdersUseCaseResponse> {
		const user = await this.usersRepository.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		const order = await this.ordersRepository.findById(orderId);
		if (!order) {
			throw new Error('Order not found');
		}

		return { order };
	}
}
