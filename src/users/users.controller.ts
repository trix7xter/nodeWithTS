import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";

export class UsersController extends BaseController {
    constructor(
        logger: LoggerService
    ) {
        super(logger);
        this.bindRouters([
            {path: '/register', method: 'post', function: this.register},
            {path: '/login', method: 'post', function: this.login}
        ])
    }

    login(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'login');
    }

    register(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'register'); 
    }
}