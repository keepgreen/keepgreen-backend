import { drizzle } from 'drizzle-orm/mysql2';
import mysql = require('mysql2');

export const DrizzleAsyncProvider = 'drizzleProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    useFactory: async () => {
      const connection = mysql.createConnection({
        host: process.env.MARIADB_HOST,
        database: process.env.MARIADB_BASE,
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASS,
        multipleStatements: true,
      });
      return drizzle(connection);
    },
    exports: [DrizzleAsyncProvider],
  },
];
