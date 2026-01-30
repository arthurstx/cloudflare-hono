export class D1OrderItemsRepository {
	constructor(private db: D1Database) {}

	prepareCreateStatements(items: Array<{ orderId: string; item: { productId: string; quantity: number } }>) {
		const query = `INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)`;
		const stmt = this.db.prepare(query);

		return items.map(({ orderId, item }) => stmt.bind(orderId, item.productId, item.quantity));
	}
}
