import { User } from '../../types/types';
import { D1UsersRepository } from '../users-repository';

export class InMemoryUsersRepository extends D1UsersRepository {
	public items: User[] = [];

	constructor() {
		super({} as D1Database);
	}

	async create(email: string, password_hash: string): Promise<void> {
		const user = {
			id: crypto.randomUUID(),
			email,
			passwordHash: password_hash,
			createdAt: new Date(),
		};

		this.items.push(user);
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = this.items.find((item) => item.email === email);

		if (!user) {
			return null;
		}

		return user;
	}

	async findById(userId: string): Promise<User | null> {
		const user = this.items.find((item) => item.id === userId);

		if (!user) {
			return null;
		}

		return user;
	}
}
