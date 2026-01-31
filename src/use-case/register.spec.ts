import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';
import { InMemoryUsersRepository } from '../repository/in-memory-repository/in-memory-users-repository';
import { hash } from 'bcryptjs';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(usersRepository);
	});

	it('should be able to register a new user', async () => {
		const { user } = await sut.execute({
			email: 'john.doe@email.com',
			password: 'password123',
		});

		expect(usersRepository.items).toHaveLength(1);
		expect(usersRepository.items[0].email).toBe('john.doe@email.com');
	});

	it('should not be able to register with an existing email', async () => {
		await sut.execute({
			email: 'john.doe@email.com',
			password: 'password123',
		});

		await expect(
			sut.execute({
				email: 'john.doe@email.com',
				password: 'password123',
			}),
		).rejects.toThrow('User already exists');
	});

	it('should hash the password upon registration', async () => {
		await sut.execute({
			email: 'john.doe@email.com',
			password: 'password123',
		});

		const user = usersRepository.items[0];
		const isPasswordCorrectlyHashed = await hash('password123', 6);
		const isSame = user.passwordHash === isPasswordCorrectlyHashed;

		expect(user.passwordHash).not.toBe('password123');
	});
});
