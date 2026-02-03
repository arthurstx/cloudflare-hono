import { RefreshToken } from '../types/types';

export class D1RefreshTokensRepository {
	constructor(private db: D1Database) {}

	async create(data: Omit<RefreshToken, 'tokenHash' | 'createdAt'> & { tokenHash: string }) {
		const query = `
      INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;

		const params = [data.id, data.userId, data.tokenHash, data.expiresAt, new Date().toISOString()];

		await this.db
			.prepare(query)
			.bind(...params)
			.run();
	}
}
