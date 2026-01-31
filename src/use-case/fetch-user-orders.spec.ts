import { beforeEach, describe, expect, it } from 'vitest';
import { FetchUserOrdersUseCase } from './fetch-user-orders';
import { InMemoryUsersRepository } from '../repository/in-memory-repository/in-memory-users-repository';
import { InMemoryOrdersRepository } from '../repository/in-memory-repository/in-memory-orders-repository';
import { Status, User } from '../types/types';

let usersRepository: InMemoryUsersRepository;
let ordersRepository: InMemoryOrdersRepository;
let sut: FetchUserOrdersUseCase;
let user: User;

describe('Fetch User Orders Use Case', () => {
	beforeEach(async () => {
		usersRepository = new InMemoryUsersRepository();
		ordersRepository = new InMemoryOrdersRepository();
		sut = new FetchUserOrdersUseCase(ordersRepository, usersRepository);

		await usersRepository.create('john.doe@email.com', 'password');
		user = usersRepository.items[0];

		ordersRepository.items.push(
			{
				id: 'order-1',
				userId: user.id,
				status: Status.PENDING,
				totalAmount: 10,
				createdAt: new Date(),
			},
			{
				id: 'order-2',
				userId: user.id,
				status: Status.DELIVERED,
				totalAmount: 20,
				createdAt: new Date(),
			},
		);
	});

	it('should be able to fetch user orders', async () => {
		const { orders } = await sut.execute({ userId: user.id });

		expect(orders).toHaveLength(2);
		expect(orders[0].id).toBe('order-1');
		expect(orders[1].id).toBe('order-2');
	});

	it('should not be able to fetch orders for a non-existent user', async () => {
		await expect(sut.execute({ userId: 'non-existent-user' })).rejects.toThrow('User not found');
	});

	it('should throw an error if user has no orders', async () => {
		ordersRepository.items = [];
		await expect(sut.execute({ userId: user.id })).rejects.toThrow('Order not found');
	});
});
