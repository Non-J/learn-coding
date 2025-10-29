/**
 * Get the top 100 most wanted list from the API server, then get additional information for each person
 *
 * However, the database admin team is complaining that you are fetching too many information at the same time.
 * Your task is to fetch the data, but at a slower rate by limiting the number of simultaneous fetch to 20
 *
 * HINT: This is the same as coding-07, but you'll need to limit the number of fetching done at once
 */

const topListResponse = await fetch("http://most-wanted.fbi.com:3000/top/100");
const topList = (await topListResponse.json()) as string[];

const topListWithIndex = topList.map(
  (item, index) => [item, index] as [string, number]
);

const tasks = [];

const result = Array(topList.length);

for (let limit = 0; limit < 20; limit++) {
  const task = (async () => {
    let entry;
    while ((entry = topListWithIndex.pop()) !== undefined) {
      const [personId, index] = entry;

      const response = await fetch(
        `http://citizen-database.fbi.com:3000?citizen_id=${personId}`
      );
      const data = await response.json();

      result[index] = data;
    }
  })();

  tasks.push(task);
}

await Promise.all(tasks);

export const ANSWER = result;
