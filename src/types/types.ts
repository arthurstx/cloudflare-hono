export enum Status {
	PENDING = 'pending',
	PAID = 'paid',
	CANCELED = 'canceled',
}

export enum Role {
	ADMIN = 'admin',
	USER = 'user',
}

type ISOString = string; // Representa o formato datetime('now') do SQLite
type UUID = string; // Representa o formato TEXT para UUIDs no SQLite

export interface User {
	id: UUID;
	email: string;
	password_hash?: string;
	role: Role;
	createdAt: ISOString;
}

export interface RefreshToken {
	id: UUID;
	userId: UUID;
	tokenHash: string;
	expiresAt: ISOString;
	createdAt: ISOString;
}

export interface Order {
	id: UUID;
	userId: UUID;
	status: Status;
	totalAmount: number;
	createdAt: ISOString;
}

export interface Product {
	id: UUID;
	name: string;
	description: string | null;
	price: number;
	stock: number;
	createdAt: ISOString;
}

export interface OrderItem {
	id: UUID;
	orderId: UUID;
	productId: UUID;
	quantity: number;
}
