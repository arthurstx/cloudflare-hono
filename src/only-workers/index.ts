import { handleAuthRoutes } from './routes';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname.startsWith('/auth')) {
			return handleAuthRoutes(request, env);
		}

		return new Response('Not Found', { status: 404 });
	},
};
