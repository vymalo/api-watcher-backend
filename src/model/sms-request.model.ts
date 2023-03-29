import { Model, Modifiers } from 'objection';
import { randomUUID } from 'crypto';

export class SmsRequestModel extends Model {
    static modifiers: Modifiers = {
        searchByQuery(query, name) {
            query.where((query) => {
                for (const namePart of name.trim().split(/\s+/)) {
                    for (const column of ['request_body']) {
                        query.orWhereRaw('lower(??) like ?', [
                            column,
                            namePart.toLowerCase() + '%',
                        ]);
                    }
                }
            });
        },
    };
    id!: string;
    created_at!: string;
    request_body!: string;

    static get tableName() {
        return 'sms_requests';
    }

    $beforeInsert() {
        this.created_at = new Date().toISOString();
        this.id = randomUUID();
    }
}
