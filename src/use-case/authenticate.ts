import { compare, hash } from 'bcryptjs';
import { D1UsersRepository } from '../repository/users-repository';
import dayjs from 'dayjs';
import { D1RefreshTokensRepository } from '../repository/refresh-token-repository';
import { User } from '../types/types';

interface AuthenticateUseCaseRequest {
	email: string;
	password: string;
}

interface AuthenticateUseCaseResponse {
	user: User;
}

export class AuthenticateUseCase {
	constructor(
		private usersRepository: D1UsersRepository,
		//private refreshRepository: D1RefreshTokensRepository,
	) {}

	async execute({ email, password }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new Error('invalid credentials');
		}

		const doesPasswordMatches = await compare(password, user.password_hash!);

		if (!doesPasswordMatches) {
			throw new Error('invalid credentials');
		}

		return { user };
	}
}
