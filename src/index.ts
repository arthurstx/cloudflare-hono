import { app } from './app';
/*
export default {
	fetch: app.fetch,
	scheduled: async (batch, env) => {},
} satisfies ExportedHandler<Env>;
*/
export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		return app.fetch(request, env, ctx);
	},
};
