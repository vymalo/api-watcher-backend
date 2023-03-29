import { Express } from 'express';

export interface BaseService {
    init(app: Express): Promise<void>;
}
