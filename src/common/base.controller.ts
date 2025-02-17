import { LoggerService } from '../logger/logger.service';
import { Router, Response } from 'express';
import { IControllerRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public created(res: Response): Response {
		return res.sendStatus(201);
	}

	public send<T>(res: Response, code: number, dto: T): Response {
		res.type('application/json');
		return res.status(code).json(dto);
	}

	public ok<T>(res: Response, dto: T): Response {
		return this.send<T>(res, 200, dto);
	}

	protected bindRouters(routers: IControllerRoute[]): void {
		for (const router of routers) {
			this.logger.log(`Binding router ${router.method.toUpperCase()} ${router.path}`);
			const middleware = router.middlewares?.map((m) => m.execute.bind(m));
			const handler = router.function.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[router.method](router.path, pipeline);
		}
	}
}
