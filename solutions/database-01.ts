/**
 * Make a database connection object
 *
 * Simply fill the blank.
 */

import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password123",
  database: "DATABASE",
});

const [result, _] = await connection.query(
  `select TABLE_NAME,COLUMN_NAME,COLUMN_TYPE from information_schema.COLUMNS where TABLE_SCHEMA like 'database_%'`
);

await connection.end();

export const ANSWER: mysql.QueryResult = result;
