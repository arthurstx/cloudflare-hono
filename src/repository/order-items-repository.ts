export class D1OrderItemsRepository {
	constructor(private db: D1Database) {}

	prepareCreateStatements(items: Array<{ orderId: string; item: { productId: string; quantity: number } }>) {
		const id = crypto.randomUUID();
		const query = `INSERT INTO order_items (id, order_id, product_id, quantity) VALUES (?, ?, ?, ?)`;
		const stmt = this.db.prepare(query);

		return items.map(({ orderId, item }) => stmt.bind(id, orderId, item.productId, item.quantity));
	}
}
