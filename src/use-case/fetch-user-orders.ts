import { D1OrdersRepository } from '../repository/orders-repository';
import { D1UsersRepository } from '../repository/users-repository';
import { Order } from '../types/types';

interface FetchUserOrdersUseCaseRequest {
	userId: string;
}

interface FetchUserOrdersUseCaseResponse {
	orders: Order[];
}

export class FetchUserOrdersUseCase {
	constructor(
		private ordersRepository: D1OrdersRepository,
		private usersRepository: D1UsersRepository,
	) {}

	async execute({ userId }: FetchUserOrdersUseCaseRequest): Promise<FetchUserOrdersUseCaseResponse> {
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
