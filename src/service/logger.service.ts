import { BaseService } from './base.service';
import { Express } from 'express';
import expressWinston from 'express-winston';
import { logger } from './logger';

export class LoggerService implements BaseService {
    public async init(app: Express): Promise<void> {
        app.use(
            expressWinston.logger({
                winstonInstance: logger,
                level: 'debug',
            })
        );
    }
}
