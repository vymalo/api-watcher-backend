import { BaseService } from './base.service';
import express, { Express } from 'express';
import * as path from 'path';

export class PublicService implements BaseService {
    public async init(app: Express): Promise<void> {
        const publicPath = path.resolve(process.cwd(), 'public');
        app.use(express.static(publicPath));
        app.use('*', express.static(publicPath));
    }
}
