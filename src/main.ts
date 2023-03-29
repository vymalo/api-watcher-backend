import { config } from 'dotenv';
import { App } from './app';

config();

async function bootstrap() {
    const app = new App();
    await app.start();
}

bootstrap();
