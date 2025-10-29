/**
 * Create an async wait/sleep/delay function using setTimeout
 *
 * When in use, your function should look like this:
 *
 * await sleep(5000); // This will wait for 5000 milliseconds, or 5 seconds
 *
 * HINT: assign this function directly to ANSWER
 */

const result = (timeMs: number) =>
  new Promise((resolve) => setTimeout(resolve, timeMs));

export const ANSWER: (timeMs: number) => Promise<any> = result;
