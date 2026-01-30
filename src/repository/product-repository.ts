import { Product } from '../types/types';

export class D1ProductsRepository {
	constructor(private db: D1Database) {}
	async findManyByIds(productIds: string[]): Promise<any[]> {
		const placeholders = productIds.map(() => '?').join(', ');
		const query = `SELECT id, name, description, price, stock, created_at FROM products WHERE id IN (${placeholders})`;
		const { results } = await this.db
			.prepare(query)
			.bind(...productIds)
			.all<Product>();
		return results;
	}
	async prepareUpdateStock(productId: string, quantity: number): Promise<D1PreparedStatement> {
		const query = `UPDATE products SET stock = stock - ? WHERE id = ?`;
		return this.db.prepare(query).bind(quantity, productId);
	}
}
