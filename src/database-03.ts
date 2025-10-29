/**
 * Select 160 students to advance to the second round of admission and assign their examination group
 *
 * Here's the rules:
 * - Top 100 students with the highest score should
 * - A special quota of 10 students per region for students who scored the highest in each region but not in the top 100
 * - The selected students should be assigned into a group of 10 students per group
 * - Each group mustn't have students from the same province
 *
 * Once you've selected the students, create a table named "exam_group" with the following columns:
 * - student_id: this is the student's ID
 * - group_number: A number from 1 to 16
 *
 * NOTE: Since you have to create a table, you don't need to provide an ANSWER.
 * 		 For the ANSWER, simply use the connection.
 */

import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "FILL IN THE BLANK HERE",
  user: "FILL IN THE BLANK HERE",
  password: "FILL IN THE BLANK HERE",
  database: "FILL IN THE BLANK HERE",
  multipleStatements: true,
});

await connection.query(
  `
  YOUR QUERY HERE
  `
);

export const ANSWER: mysql.Connection = connection; // Don't change this
