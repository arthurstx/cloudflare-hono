import { beforeEach, describe, expect, it } from 'vitest';
import { SearchOrdersUseCase } from './search-orders';
import { InMemoryUsersRepository } from '../repository/in-memory-repository/in-memory-users-repository';
import { InMemoryOrdersRepository } from '../repository/in-memory-repository/in-memory-orders-repository';
import { Status, User } from '../types/types';

let usersRepository: InMemoryUsersRepository;
let ordersRepository: InMemoryOrdersRepository;
let sut: SearchOrdersUseCase;
let user: User;

describe('Search Orders Use Case', () => {
	beforeEach(async () => {
		usersRepository = new InMemoryUsersRepository();
		ordersRepository = new InMemoryOrdersRepository();
		sut = new SearchOrdersUseCase(ordersRepository, usersRepository);

		await usersRepository.create('john.doe@email.com', 'password');
		user = usersRepository.items[0];

		ordersRepository.items.push({
			id: 'order-1',
			userId: user.id,
			status: Status.PENDING,
			totalAmount: 10,
			createdAt: new Date(),
		});
	});

	it('should be able to search for an order', async () => {
		const { order } = await sut.execute({ userId: user.id, orderId: 'order-1' });

		expect(order.id).toBe('order-1');
	});

	it('should not be able to search for an order with a non-existent user', async () => {
		await expect(sut.execute({ userId: 'non-existent-user', orderId: 'order-1' })).rejects.toThrow('User not found');
	});

	it('should not be able to search for a non-existent order', async () => {
		await expect(sut.execute({ userId: user.id, orderId: 'non-existent-order' })).rejects.toThrow('Order not found');
	});
});
