import { ApiService } from './service/api.service';
import express from 'express';
import * as http from 'http';
import { AuthService } from './service/auth.service';
import { CommonService } from './service/common.service';
import { LoggerService } from './service/logger.service';
import { RepoService } from './service/repo.service';
import { SocketService } from './service/socket.service';
import { logger } from './service/logger';
import { PublicService } from './service/public.service';

export class App {
    private readonly app: express.Express = express();
    private readonly server: http.Server = http.createServer(this.app);
    private readonly socketService = new SocketService(this.server);
    private readonly commonService = new CommonService();
    private readonly repoService = new RepoService();
    private readonly loggerService = new LoggerService();
    private readonly authService = new AuthService();
    private readonly apiService = new ApiService(this.socketService);
    private readonly publicService = new PublicService();

    async start(port = process.env.PORT) {
        await this.initAll();
        this.server.listen(port, () => {
            logger.info(`Server started at http://localhost:${port}`);
        });
    }

    private async initAll() {
        await this.commonService.init(this.app);
        await this.socketService.init();
        await this.repoService.init();
        await this.loggerService.init(this.app);
        await this.authService.init(this.app);
        await this.apiService.init(this.app);
        await this.publicService.init(this.app);
    }
}
