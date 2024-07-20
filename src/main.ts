import { Container, ContainerModule, interfaces } from "inversify";
import { LoggerService } from "./logger/logger.service";
import { ILogger } from "./logger/logger.interface";
import { TYPES } from "./types";
import { ExeptionFilter } from "./errors/exeption.filter";
import { UsersController } from "./users/users.controller";
import { App } from "./app";
import { IExeptionFilter } from "./errors/exeption.filter.interface";
import 'reflect-metadata';


export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService);
    bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
    bind<UsersController>(TYPES.UsersController).to(UsersController);
    bind<App>(TYPES.Application).to(App);
})

function bootstrap() {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init()
    return { app, appContainer };
}

export const { app, appContainer } = bootstrap();