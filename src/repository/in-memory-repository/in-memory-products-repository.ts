import { Product } from '../../types/types';
import { D1ProductsRepository } from '../product-repository';

export class InMemoryProductsRepository extends D1ProductsRepository {
	public items: Product[] = [];
	constructor() {
		super({} as D1Database);
	}
	async findManyByIds(productIds: string[]): Promise<any[]> {
		return this.items.filter((item) => productIds.includes(item.id));
	}
	async prepareUpdateStock(productId: string, quantity: number): Promise<any> {
		const product = this.items.find((item) => item.id === productId);

		if (product) {
			product.stock -= quantity;
		}

		return Promise.resolve();
	}
}
