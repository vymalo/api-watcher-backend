import { ApiImplementation } from '../gen/api/types';
import { SmsApiImpl } from './sms.api.impl';
import init_api from '../gen/api';
import { Express } from 'express';
import { BaseService } from './base.service';
import { SocketService } from './socket.service';

export class ApiService implements ApiImplementation, BaseService {
    constructor(
        socketService: SocketService,
        private readonly _sms = new SmsApiImpl(socketService)
    ) {}

    get sms() {
        return this._sms;
    }

    public async init(app: Express) {
        init_api(app, this);
    }
}
