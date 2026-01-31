import { Order, Status } from '../../types/types';
import { D1OrdersRepository } from '../orders-repository';

export class InMemoryOrdersRepository extends D1OrdersRepository {
	public items: Order[] = [];
	constructor() {
		super({} as D1Database);
	}

	async prepareCreate(orderData: { id: string; userId: string; status: Status; total: number }): Promise<any> {
		const order: Order = {
			id: orderData.id,
			userId: orderData.userId,
			status: orderData.status,
			totalAmount: orderData.total,
			createdAt: new Date(),
		};

		this.items.push(order);
		return Promise.resolve();
	}

	async findById(id: string) {
		const order = this.items.find((item) => item.id === id);
		return order || null;
	}

	async findManyByUserId(userId: string): Promise<Order[]> {
		return this.items.filter((item) => item.userId === userId);
	}
}
