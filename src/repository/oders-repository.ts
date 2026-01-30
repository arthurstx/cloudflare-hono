import { Status } from '../types/types';

export class D1OrdersRepository {
	constructor(private db: D1Database) {}
	async prepareCreate(orderData: { id: string; userId: string; status: Status; total: number }): Promise<D1PreparedStatement> {
		const query = `INSERT INTO orders (id, user_id, status, total_amount, created_at) VALUES (?, ?, ?, ?, datetime('now'))`;
		return this.db.prepare(query).bind(orderData.id, orderData.userId, orderData.status, orderData.total);
	}
}
