import Knex from 'knex';
import knexConfig from '../repo/config';

import { Model } from 'objection';
import { SmsRequestModel } from '../model/sms-request.model';
import { BaseService } from './base.service';

export class RepoService implements BaseService {
    constructor(private readonly knex = Knex(knexConfig())) {
        Model.knex(knex);
    }

    public async init() {
        await this.createSchema();
    }

    private async createSchema() {
        if (await this.knex.schema.hasTable(SmsRequestModel.tableName)) {
            return;
        }

        // Create database schema. You should use knex migration files
        // to do this. We create it here for simplicity.
        await this.knex.schema.createTable(
            SmsRequestModel.tableName,
            (table) => {
                table.uuid('id').primary();
                table.datetime('created_at').defaultTo(this.knex.fn.now());
                table.string('request_body');
            }
        );
    }
}
