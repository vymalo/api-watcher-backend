import * as path from 'path';
import * as fs from 'fs';
import KnexSqlite3 from 'knex/lib/dialects/sqlite3';

const config = () => {
    const dir = path.resolve(process.cwd(), process.env.DATA_PATH!);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return {
        client: KnexSqlite3,
        useNullAsDefault: true,
        connection: {
            filename: path.join(dir, 'app_data.db'),
        },
        pool: {
            afterCreate: (conn, cb) => {
                conn.run('PRAGMA foreign_keys = ON', cb);
            },
        },
    };
};

export default config;
