/**
 * Get the top 100 most wanted list from the API server, then get additional information for each person
 *
 * Notice that the most wanted list give an ID rather than the person's information.
 * To get the person's information, you'll need to get it from http://citizen-database.fbi.com:3000?citizen_id=1-2345-67890-12-3 (replace the ID with the one from the list)
 *
 * HINT: This is the same as coding-06, but you'll need to make multiple fetch at once or the test will error with timeout!
 */

const topListResponse = await fetch("http://most-wanted.fbi.com:3000/top/100");
const topList = (await topListResponse.json()) as string[];

const tasks = [];

for (const personId of topList) {
  const task = fetch(
    `http://citizen-database.fbi.com:3000?citizen_id=${personId}`
  ).then((response) => response.json());

  tasks.push(task);
}

const result = await Promise.all(tasks);

export const ANSWER = result;
