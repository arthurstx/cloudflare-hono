import { hash } from 'bcryptjs';
import { D1UsersRepository } from '../repository/users-repository';

interface RegisterUseCaseRequest {
	email: string;
	password: string;
}

export class RegisterUseCase {
	constructor(private usersRepository: D1UsersRepository) {}

	async execute({ email, password }: RegisterUseCaseRequest) {
		const password_hash = await hash(password, 6);
		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw new Error('User already exists');
		}

		const user = await this.usersRepository.create(email, password_hash);
		return { user };
	}
}
