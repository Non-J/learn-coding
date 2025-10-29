/**
 * Get the first 100 students from the Southern region, sorted by student's name.
 *
 * HINT: Output should look like this:
 */

import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password123",
  database: "DATABASE",
});

const [result, _] = await connection.query(
  `
select students.id as id, students.name as name, schools.name as school
from students
         left join schools on students.school = schools.id
         left join provinces on schools.province = provinces.id
where provinces.region = 'South'
order by students.name
limit 100
  `
);

await connection.end();

export const ANSWER: mysql.QueryResult = result;
