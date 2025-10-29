/**
 * Calculate the sum of prime numbers that are less than 1000.
 *
 * HINT: ANSWER = 2 + 3 + 5 + 7 + 11 + ... + 997
 */

function isPrime(n: number) {
  for (let i = 2; i < n - 1; i++) {
    if (n % i === 0) {
      return false;
    }
  }

  return true;
}

let sum = 0;

for (let i = 2; i < 1000; i++) {
  if (isPrime(i)) {
    sum += i;
  }
}

export const ANSWER: number = sum;
