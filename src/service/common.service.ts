import { BaseService } from './base.service';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import errorhandler from 'errorhandler';

export class CommonService implements BaseService {
    public async init(app: Express): Promise<void> {
        app.use(
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: [
                            "'self'",
                            "'unsafe-eval'",
                            "'unsafe-inline'",
                        ],
                        scriptSrc: null,
                    },
                },
            })
        );

        app.use(cors());
        app.use(compression());
        app.use(errorhandler());

        app.use(express.json());
        app.use(express.raw());
        app.use(express.text());
        app.use(express.urlencoded());
    }
}
