import { hash } from "node:crypto";
import { targetModules } from "./utils";
import stringify from "safe-stable-stringify";
import type { RowDataPacket } from "mysql2";

test("Database 01", async () => {
  const module = await targetModules["database-01"]();

  expect(module.ANSWER).toMatchSnapshot();
  expect(
    hash("MD5", stringify(module.ANSWER) ?? "", "base64url")
  ).toStrictEqual("noA-HE-NVe7_hKnPiPyrvQ");
});

test("Database 02", async () => {
  const module = await targetModules["database-02"]();

  expect(module.ANSWER).toMatchSnapshot();
  expect(
    hash("MD5", stringify(module.ANSWER) ?? "", "base64url")
  ).toStrictEqual("JmmbTzToGi29Cl10vmp1UA");
});

test("Database 03", async () => {
  const module = await targetModules["database-03"]();

  try {
    const [resultIds] = await module.ANSWER.query<RowDataPacket[]>(
      `select group_concat(id order by id separator ',') as answer from exam_group`
    );

    const [checker] = await module.ANSWER.query<RowDataPacket[]>(`
with summary as (select exam_group.group_number,
                        count(exam_group.id)         as group_size,
                        count(distinct provinces.id) AS group_provinces
                 from exam_group
                          left join students on exam_group.id = students.id
                          left join schools on students.school = schools.id
                          left join provinces on schools.province = provinces.id
                 group by exam_group.group_number)
select sum(group_size = 10)       as group_size,
       sum(group_provinces = 10)  as group_provinces,
       min(group_number)            as group_number_start,
       max(group_number)            as group_number_end,
       count(distinct group_number) as group_number_distinct
from summary;
  `);

    expect(resultIds[0]?.["answer"]).toStrictEqual(
      "24,39,70,79,87,95,113,135,158,191,242,304,345,346,391,393,422,447,468,472,488,530,581,604,608,609,626,632,638,654,675,700,721,764,795,804,805,806,807,831,837,851,860,918,935,944,950,967,1010,1034,1037,1038,1044,1108,1134,1169,1170,1190,1196,1201,1203,1216,1230,1237,1240,1247,1252,1268,1271,1302,1328,1412,1429,1482,1511,1529,1533,1535,1537,1539,1558,1563,1623,1647,1650,1671,1673,1691,1718,1722,1733,1747,1765,1766,1788,1803,1829,1842,1858,1862,1869,1897,1912,1921,1957,1991,2018,2059,2061,2063,2065,2080,2089,2096,2133,2141,2167,2173,2184,2229,2246,2300,2323,2346,2354,2365,2383,2390,2424,2435,2453,2497,2505,2506,2519,2534,2545,2566,2578,2586,2594,2604,2645,2651,2662,2683,2692,2703,2793,2816,2820,2858,2892,2921,2946,2957,2981,2989,2999,3000"
    );
    expect(Number(checker[0]?.["group_size"])).toStrictEqual(16);
    expect(Number(checker[0]?.["group_provinces"])).toStrictEqual(16);
    expect(Number(checker[0]?.["group_number_start"])).toStrictEqual(1);
    expect(Number(checker[0]?.["group_number_end"])).toStrictEqual(16);
    expect(Number(checker[0]?.["group_number_distinct"])).toStrictEqual(16);
  } finally {
    module.ANSWER.end().catch((err) => console.error(err));
  }
});
