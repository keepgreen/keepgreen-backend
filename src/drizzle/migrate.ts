import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql = require('mysql2');
import 'dotenv/config';

const connection = mysql.createConnection({
  host: process.env.MARIADB_HOST,
  database: process.env.MARIADB_BASE,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASS,
  multipleStatements: true,
});

const db = drizzle(connection);

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: 'src/drizzle/migrations' });
    connection.end();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
