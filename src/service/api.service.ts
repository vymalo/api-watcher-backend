import { ApiImplementation } from '../gen/api/types';
import { ApiApiImpl } from './api.api.impl';
import init_api from '../gen/api';
import { Express } from 'express';
import { BaseService } from './base.service';
import { SocketService } from './socket.service';

export class ApiService implements ApiImplementation, BaseService {
    constructor(
        socketService: SocketService,
        private readonly _api = new ApiApiImpl(socketService)
    ) {}

    get api() {
        return this._api;
    }

    public async init(app: Express) {
        app.post('/api/*', (req, res, next) => {
            req.url = '/api';
            next('route');
        });
        init_api(app, this);
    }
}
