/**
 * Get the top 100 most wanted list from an API server
 *
 *
 * What you'll need to do:
 * 1) Check that the API server is started in background
 * 2) Check that the API server is working by going to "http://most-wanted.fbi.com:3000/top/100" (try it in your web browser without the quote marks!)
 * 3) Use the "fetch" function to get this list and give the list as the answer
 */

const response = await fetch("http://most-wanted.fbi.com:3000/top/100");
const result = await response.json();

export const ANSWER = result;
