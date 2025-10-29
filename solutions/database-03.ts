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
  host: "localhost",
  user: "root",
  password: "password123",
  database: "DATABASE",
  multipleStatements: true,
});

await connection.query(
  `
drop table if exists exam_group;

create temporary table if not exists provinces_rand as (select provinces.id as province_id, rand() as province_rand from provinces);

create table exam_group as (with students_top_100 as (select students.*,
                                                             sum(exam_scores.score) as total_score
                                                      from students
                                                               left join exam_scores on students.id = exam_scores.student
                                                      group by students.id
                                                      order by total_score desc
                                                      limit 100),
                                 student_regional_rankings as (select students.*,
                                                                      provinces.region,
                                                                      sum(exam_scores.score) as                                                        total_score,
                                                                      rank() over (partition by provinces.region order by sum(exam_scores.score) desc) ranking
                                                               from students
                                                                        left join schools on students.school = schools.id
                                                                        left join provinces on schools.province = provinces.id
                                                                        left join exam_scores on students.id = exam_scores.student
                                                               where students.id not in (select id from students_top_100)
                                                               group by students.id),
                                 students_regional_top_10 as (select *
                                                              from student_regional_rankings
                                                              where ranking <= 10),
                                 students_passed_ids as ((select id from students_top_100)
                                                         union
                                                         (select id from students_regional_top_10)),
                                 students_order_rand as (select students.id,
                                                                provinces.name,
                                                                province_rand,
                                                                provinces.name as pn
                                                         from students
                                                                  left join schools
                                                                            on students.school = schools.id
                                                                  left join provinces on schools.province = provinces.id
                                                                  left join provinces_rand on provinces.id = provinces_rand.province_id
                                                         where students.id in (select id from students_passed_ids))
                            select id,
                                   mod(row_number() over (order by province_rand, rand()), 16) + 1 as group_number
                            from students_order_rand);
`
);

export const ANSWER: mysql.Connection = connection; // Don't change this
