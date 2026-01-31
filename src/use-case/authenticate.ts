import { compare } from 'bcryptjs';
import { User } from '../types/types';
import { D1UsersRepository } from '../repository/users-repository';

interface AuthenticateUseCaseRequest {
	email: string;
	password: string;
}

interface AuthenticateUseCaseResponse {
	user: User;
}

export class AuthenticateUseCase {
	constructor(private usersRepository: D1UsersRepository) {}

	async execute({ email, password }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new Error('invalid credentials');
		}

		const doesPasswordMatches = await compare(password, user.passwordHash!);

		if (!doesPasswordMatches) {
			throw new Error('invalid credentials');
		}
		return { user };
	}
}
