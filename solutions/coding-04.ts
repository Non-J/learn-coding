/**
 * Enhance the fake people dataset by adding the following information:
 *
 * - isRetirementAge
 *    - Set isRetirementAge to true if the person was born before the year 1950 (exclude the year 1950)
 * - phones.containsLuckyNumber
 *    - For each phone number, set containsLuckyNumber to true if it contains 888 or 999, and no 4.
 *
 *
 *  HINT: While there's many ways to do this, you should try using .map() and spread syntax!
 */

import fakePeopleDataset from "../data/fake-people-us.json"; // HINT: Check out the dataset for ideas before starting the task

const result = fakePeopleDataset.map((person) => ({
  ...person,
  isRetirementAge: new Date(person.birthday).getUTCFullYear() < 1950,
  phones: person.phones.map((phone) => ({
    ...phone,
    containsLuckyNumber:
      (phone.number.includes("888") || phone.number.includes("999")) &&
      !phone.number.includes("4"),
  })),
}));

export const ANSWER = result;
