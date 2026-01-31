import { AuthenticateUseCase } from './authenticate';
import { InMemoryUsersRepository } from '../repository/in-memory-repository/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { hash } from 'bcryptjs';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate use case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(usersRepository);
	});

	it('should be able to authenticate', async () => {
		await usersRepository.create('john.doe@email.com', await hash('123456', 6));

		const { user } = await sut.execute({
			email: 'john.doe@email.com',
			password: '123456',
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it('should not be able to authenticate with wrong email', async () => {
		await expect(() =>
			sut.execute({
				email: 'john.doe@email.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(Error);
	});

	it('should not be able to authenticate with wrong password', async () => {
		await usersRepository.create('john.doe@email.com', await hash('123456', 6));

		await expect(() =>
			sut.execute({
				email: 'john.doe@email.com',
				password: 'wrong-password',
			}),
		).rejects.toBeInstanceOf(Error);
	});
});
