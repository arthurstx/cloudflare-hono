import { User } from '../types/types';

export class D1UsersRepository {
	constructor(private db: D1Database) {}
	async findById(userId: string): Promise<User | null> {
		const query = `SELECT id, email, created_at FROM users WHERE id = ?`;
		const result = await this.db.prepare(query).bind(userId).first<User>();
		return result;
	}
}
