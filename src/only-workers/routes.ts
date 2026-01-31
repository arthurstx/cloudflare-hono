import { register } from './register.controller';

export async function handleAuthRoutes(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);

	if (url.pathname === '/auth/register' && request.method === 'POST') {
		return register(request, env);
	}

	return new Response('Not Found', { status: 404 });
}
