import { Order, Status } from '../types/types';

export class D1OrdersRepository {
	constructor(private db: D1Database) {}

	async prepareCreate(orderData: { id: string; userId: string; status: Status; total: number }): Promise<D1PreparedStatement> {
		const query = `INSERT INTO orders (id, user_id, status, total_amount, created_at) VALUES (?, ?, ?, ?, datetime('now'))`;
		return this.db.prepare(query).bind(orderData.id, orderData.userId, orderData.status, orderData.total);
	}

	async findById(id: string) {
		const query = `SELECT * FROM orders WHERE id = ?`;
		const result = await this.db.prepare(query).bind(id).first<Order>();
		return result || null;
	}

	async findManyByUserId(userId: string): Promise<Order[]> {
		const query = `SELECT * FROM orders WHERE user_id = ?`;
		const results = await this.db.prepare(query).bind(userId).all<Order>();
		return results.results;
	}

	async updateStatus(id: string, userId: string): Promise<D1Result> {
		const query = `UPDATE orders SET status = ? WHERE id = ? AND user_id = ?`;
		const order = await this.db.prepare(query).bind(Status.PAID, id, userId).run();
		return order;
	}

	async canceledOrder(id: string, userId: string): Promise<D1Result> {
		const query = `UPDATE orders SET status = ? WHERE id = ? AND user_id = ?`;
		const order = await this.db.prepare(query).bind(Status.CANCELED, id, userId).run();
		return order;
	}
}
