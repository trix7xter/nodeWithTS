import { Logger } from 'tslog';
import { ILogger } from './logger.interface';

export class LoggerService implements ILogger{
    public logger: Logger<unknown>;

    constructor() {
        this.logger = new Logger<unknown>(
            {
                type: "pretty", // Тип логгера
            }
        );
    }

    log(...args: unknown[]): void {
        this.logger.info(...args);
    }

    error(...args: unknown[]): void {
        this.logger.error(...args);
    }

    warn(...args: unknown[]): void {
        this.logger.warn(...args);
    }
}
