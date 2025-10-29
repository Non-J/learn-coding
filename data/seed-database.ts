import mysql from "mysql2/promise";
import { readFile } from "node:fs/promises";
import { fakerTH } from "@faker-js/faker";

import schools from "./schools.json";
import provinces from "./provinces.json";

type School = {
  id: number;
  name: string;
  district: string;
};

const connection = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password123",
  database: "DATABASE",
  multipleStatements: true,
});

const donationPurposes = [
  "ซื้ออุปกรณ์การเรียน",
  "ปรับปรุงห้องเรียน",
  "ซ่อมแซมอาคารสถานที่",
  "จัดซื้อคอมพิวเตอร์",
  "จัดกิจกรรมวันสำคัญ",
  "สนับสนุนกีฬานักเรียน",
  "จัดซื้อเครื่องดนตรี",
  "จัดทำสื่อการสอน",
  "พัฒนาแหล่งเรียนรู้",
  "ปรับปรุงสนามเด็กเล่น",
  "จัดโครงการอบรมครู",
  "จัดทัศนศึกษา",
  "สนับสนุนทุนการศึกษา",
  "ปรับปรุงห้องสมุด",
  "จัดซื้อเฟอร์นิเจอร์ห้องเรียน",
  "จัดกิจกรรมแนะแนวอาชีพ",
  "ปรับปรุงระบบไฟฟ้าและแสงสว่าง",
  "ปรับปรุงระบบน้ำประปา",
  "พัฒนาสิ่งแวดล้อม",
] as const;

const seedTables = async (connection: mysql.Connection) => {
  const seedScript = await readFile("./seed.sql", "utf8");
  console.log("executing seed script");
  await connection.query(seedScript);
  console.log("done seed script");

  const provinceNameToId = new Map(provinces.map((p) => [p.name_th, p.id]));
  const insertSchools = (schools as School[]).map(
    (s) => [s.id, s.name, provinceNameToId.get(s.district)] as const
  );

  await connection.query(`INSERT INTO schools (id, name, province) VALUES ?`, [
    insertSchools,
  ]);
  console.log("inserted schools");

  fakerTH.seed(0);

  const insertExamScores: [number, number, number][] = [];
  const insertStudents: [number, string, number][] = [];
  const insertDonations: [string, number, string | undefined][] = [];

  for (let studentId = 1; studentId <= 3000; studentId++) {
    const firstName = fakerTH.person.firstName();
    const lastName = fakerTH.person.lastName();
    const donorName = fakerTH.person.firstName();

    const donateChance = fakerTH.datatype.boolean({
      probability: 60.0 / 3000.0,
    });
    const donateAmount = fakerTH.number.int({
      min: 10000,
      max: 1000000,
      multipleOf: 1000,
    });
    const donatePurpose =
      donationPurposes[
        fakerTH.number.int({
          min: 0,
          max: donationPurposes.length - 1,
        })
      ];

    const schoolId = fakerTH.number.int({
      min: 1,
      max: (schools as School[]).length,
    });

    for (let subject = 1; subject <= 8; subject++) {
      insertExamScores.push([
        studentId,
        subject,
        fakerTH.number.int({ min: 0, max: 100 }),
      ]);
    }

    if (donateChance) {
      insertDonations.push([
        `${donorName} ${lastName}`,
        donateAmount,
        donatePurpose,
      ]);
    }

    insertStudents.push([studentId, `${firstName} ${lastName}`, schoolId]);
  }

  console.log("generated fake data");
  await connection.query(`INSERT INTO students (id, name, school) VALUES ?`, [
    insertStudents,
  ]);
  console.log("inserted students");
  await connection.query(
    `INSERT INTO exam_scores (student, subject, score) VALUES ?`,
    [insertExamScores]
  );
  console.log("inserted scores");
  await connection.query(
    `INSERT INTO special_contributions (donor_name, amount, purpose) VALUES ?`,
    [insertDonations]
  );
  console.log("inserted donations");

  await connection.query(
    `
    update students set name = 'สมศักดิ์ บุรณศิริ' where id = 1053;
    update exam_scores SET score = 69 where student = 1196 and subject = 4;
    update exam_scores SET score = 0 where student = 1110 and subject = 6;
    `
  );
  console.log("done special updates");
};

const createUser = async (
  connection: mysql.Connection,
  suffix: string,
  copyFromDatabase: boolean = false
) => {
  const databaseName = `database_${suffix}`;
  const userName = `user_${suffix}`;
  const sql = `
    drop schema if exists ??;
    drop user if exists ??;

    create schema ??;
    create user ?? identified by 'password123';

    grant ALL PRIVILEGES on ??.* to ??;
  `;

  await connection.query(sql, [
    databaseName,
    userName,
    databaseName,
    userName,
    databaseName,
    userName,
  ]);
  console.log(`created user '${userName}' and database '${databaseName}'`);

  if (copyFromDatabase) {
    const sql = `
    CREATE TABLE ??.subjects LIKE DATABASE.subjects;
      CREATE TABLE ??.provinces LIKE DATABASE.provinces;
      CREATE TABLE ??.schools LIKE DATABASE.schools;
      CREATE TABLE ??.students LIKE DATABASE.students;
      CREATE TABLE ??.exam_scores LIKE DATABASE.exam_scores;
      CREATE TABLE ??.special_contributions LIKE DATABASE.special_contributions;

      INSERT INTO ??.subjects SELECT * FROM DATABASE.subjects;
      INSERT INTO ??.provinces SELECT * FROM DATABASE.provinces;
      INSERT INTO ??.schools SELECT * FROM DATABASE.schools;
      INSERT INTO ??.students SELECT * FROM DATABASE.students;
      INSERT INTO ??.exam_scores SELECT * FROM DATABASE.exam_scores;
      INSERT INTO ??.special_contributions SELECT * FROM DATABASE.special_contributions;
    `;

    await connection.query(sql, [
      databaseName,
      databaseName,
      databaseName,
      databaseName,
      databaseName,
      databaseName,
      databaseName,
      databaseName,
      databaseName,
      databaseName,
      databaseName,
      databaseName,
    ]);
    console.log(`copied data for database '${databaseName}'`);
  }
};

await seedTables(connection);

const tasks: Promise<any>[] = [];

for (let i = 0; i < 100; i++) {
  tasks.push(createUser(connection, i.toString().padStart(2, "0"), true));
}

await Promise.all(tasks);
await connection.end();
