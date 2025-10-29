/**
 * Among the fake people in our dataset, how many of each gender lives in each US states?
 *
 * Output should be in the following format:
 * {
 *   "NY": 58,
 *   "NJ": 54,
 *   "TX": 59,
 *      ...
 * }
 *
 * Order is irrelevant for this task.
 */

import fakePeopleDataset from "../data/fake-people-us.json"; // HINT: Check out the dataset for ideas before starting the task

const result: Record<string, number> = {};

for (const person of fakePeopleDataset) {
  const category = person.address.state;

  const previousCount = result[category];

  if (previousCount !== undefined) {
    result[category] = previousCount + 1;
  } else {
    result[category] = 1;
  }
}

export const ANSWER: Record<string, number> = result;
