/**
 * Get the first 100 students from the Southern region, sorted by student's name.
 *
 * HINT: Output should look like this:
 */

import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "FILL IN THE BLANK HERE",
  user: "FILL IN THE BLANK HERE",
  password: "FILL IN THE BLANK HERE",
  database: "FILL IN THE BLANK HERE",
});

const [result, _] = await connection.query(
  `
  YOUR QUERY HERE
  `
);

await connection.end();

export const ANSWER: mysql.QueryResult = result;
