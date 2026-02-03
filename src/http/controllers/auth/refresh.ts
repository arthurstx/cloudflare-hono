import { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { jwtVerify, SignJWT } from 'jose';
export async function refresh(c: Context<{ Bindings: Env }>) {
	const secreteKey = new TextEncoder().encode(c.env.JWT_SECRET);

	const cookie = getCookie(c, 'refresh_token');

	const jwt = await jwtVerify(cookie!, secreteKey);

	const userId = jwt.payload.sub;
	const userRole = jwt.payload.role;

	const token = await new SignJWT({ role: userRole })
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setSubject(userId!)
		.setIssuedAt()
		.setExpirationTime('15m')
		.sign(secreteKey);

	const refresh_token = await new SignJWT({ role: userRole })
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setSubject(userId!)
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(secreteKey);

	setCookie(c, 'refresh_token', refresh_token, {
		httpOnly: true,
		secure: true,
		sameSite: 'Lax',
	});

	return c.json({ token }, 200);
}
