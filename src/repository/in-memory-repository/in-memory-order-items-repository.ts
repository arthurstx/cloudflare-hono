import { OrderItem } from '../../types/types';
import { D1OrderItemsRepository } from '../order-items-repository';

export class InMemoryOrderItemsRepository extends D1OrderItemsRepository {
	public items: OrderItem[] = [];

	constructor() {
		super({} as D1Database);
	}

	prepareCreateStatements(items: Array<{ orderId: string; item: { productId: string; quantity: number } }>) {
		const newItems: OrderItem[] = items.map(({ orderId, item }) => ({
			id: crypto.randomUUID(),
			orderId,
			productId: item.productId,
			quantity: item.quantity,
		}));

		this.items.push(...newItems);
		return newItems.map(() => ({
			run: () => Promise.resolve(),
		})) as any;
	}
}
