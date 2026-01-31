import { D1OrdersRepository } from '../repository/oders-repository';
import { D1OrderItemsRepository } from '../repository/order-items-repository';
import { D1ProductsRepository } from '../repository/product-repository';
import { D1UsersRepository } from '../repository/users-repository';
import { Status } from '../types/types';

interface CreateOrderUseCaseRequest {
	userId: string;
	products: Array<{
		productId: string;
		quantity: number;
	}>;
	orderDate?: Date;
}

interface CreateOrderUseCaseResponse {
	orderId: string;
	products: Array<{
		productId: string;
		quantity: number;
	}>;
	orderDate: Date;
	status: Status;
	total: number;
}

export class CreateOrderUseCase {
	constructor(
		private db: D1Database,
		private userRepository: D1UsersRepository,
		private productRepository: D1ProductsRepository,
		private orderRepository: D1OrdersRepository,
		private orderItemsRepository: D1OrderItemsRepository,
	) {}
	async execute({ userId, products, orderDate }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		const productIds = products.map((p) => p.productId);
		const productsData = await this.productRepository.findManyByIds(productIds);

		const batchStatements = [];
		let totalAmount = 0;

		for (const item of products) {
			const dbProduct = productsData.find((p: any /*TODO: fix me*/) => p.id === item.productId);

			if (!dbProduct) throw new Error(`Product ${item.productId} not found`);
			if (dbProduct.stock < item.quantity) throw new Error(`Insufficient stock for ${dbProduct.name}`);

			totalAmount += dbProduct.price * item.quantity;

			batchStatements.push(await this.productRepository.prepareUpdateStock(item.productId, item.quantity));
		}

		const orderStatementId = crypto.randomUUID();

		const orderStatement = await this.orderRepository.prepareCreate({
			id: orderStatementId,
			userId,
			status: Status.PENDING,
			total: totalAmount,
		});

		const itemsStatement = products.map((product) => ({
			orderId: orderStatementId,
			item: {
				productId: product.productId,
				quantity: product.quantity,
			},
		}));

		const orderItems = this.orderItemsRepository.prepareCreateStatements(itemsStatement);

		const results = await this.db.batch([orderStatement, ...orderItems, ...batchStatements]);

		results.map((result) => {
			if (!result.success) {
				throw new Error('Failed to create order');
			}
		});

		return {
			orderId: orderStatementId,
			products,
			orderDate: orderDate || new Date(),
			status: Status.PENDING,
			total: totalAmount,
		};
	}
}
