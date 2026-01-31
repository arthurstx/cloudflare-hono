import { User } from '../types/types';

export class D1UsersRepository {
	constructor(private db: D1Database) {}

	async create(email: string, password_hash: string): Promise<void> {
		const id = crypto.randomUUID();
		const query = `INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, datetime( 'now' ))`;
		await this.db.prepare(query).bind(id, email, password_hash).run();
	}

	async findByEmail(email: string): Promise<User | null> {
		const query = `SELECT id, email, password_hash, created_at FROM users WHERE email = ?`;
		const result = await this.db.prepare(query).bind(email).first<User>();
		return result;
	}

	async findById(userId: string): Promise<User | null> {
		const query = `SELECT id, email, created_at FROM users WHERE id = ?`;
		const result = await this.db.prepare(query).bind(userId).first<User>();
		return result;
	}
}
