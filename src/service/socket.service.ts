import { BaseService } from './base.service';
import * as http from 'http';
import { Server } from 'socket.io';
import { logger } from './logger';

export class SocketService implements BaseService {
    private readonly ioServer: Server;

    constructor(ioServer: http.Server) {
        this.ioServer = new Server(ioServer, {
            cors: {
                origin: true,
            },
        });
    }

    public async init(): Promise<void> {
        this.ioServer.on('connection', (socket) => {
            let msg = '[' + socket.request.connection.remoteAddress + ']: ';
            msg += socket.request.headers['user-agent'];
            msg += ' | App connected';
            logger.debug(msg);
        });
    }

    public send(key: string, payload: Record<string, any>) {
        this.ioServer.emit(`msg-##-${key}`, payload);
    }
}
