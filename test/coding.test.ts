import {
  doFetchSpy,
  fetchTracker,
  importWithTiming,
  targetModules,
} from "./utils.ts";
import { stringify } from "safe-stable-stringify";
import { hash } from "node:crypto";

test("Coding 01", async () => {
  const module = await targetModules["coding-01"]();

  expect(module.ANSWER).toStrictEqual("WRONG");
});

test("Coding 02", async () => {
  const module = await targetModules["coding-02"]();

  expect(module.ANSWER).toStrictEqual(76127);
});

test("Coding 03", async () => {
  const module = await targetModules["coding-03"]();

  expect(module.ANSWER).toMatchSnapshot();
  expect(
    hash("MD5", stringify(module.ANSWER) ?? "", "base64url")
  ).toStrictEqual("mz_m2nVDtA01eY1eI9f0wQ");
});

test("Coding 04", async () => {
  const module = await targetModules["coding-04"]();

  expect(module.ANSWER).toMatchSnapshot();
  expect(
    hash("MD5", stringify(module.ANSWER) ?? "", "base64url")
  ).toStrictEqual("JeQjOwb61oW2DrJ9wZzmMw");
});

test("Coding 05", async () => {
  const module = await targetModules["coding-05"]();

  expect(module.ANSWER).toMatchSnapshot();
  expect(
    hash("MD5", stringify(module.ANSWER) ?? "", "base64url")
  ).toStrictEqual("ZMBK09NUJ_EOLOBya9irwg");
});

test("Coding 06", async () => {
  const module = await targetModules["coding-06"]();

  expect(module.ANSWER).toMatchSnapshot();
  expect(
    hash("MD5", stringify(module.ANSWER) ?? "", "base64url")
  ).toStrictEqual("K7by1KvmTsJEKjyQwt0B6A");
}, 10000);

test("Coding 07", async () => {
  const module = await targetModules["coding-07"]();

  expect(module.ANSWER).toMatchSnapshot();
  expect(
    hash("MD5", stringify(module.ANSWER) ?? "", "base64url")
  ).toStrictEqual("hO5gbUqksT_EtorxIkVVhA");
}, 10000);

test("Coding 08", async () => {
  const module = await targetModules["coding-08"]();

  let yieldCheckCounter = 0;
  const yieldCheckLoop = setInterval(() => yieldCheckCounter++, 50);

  await Promise.all(
    [500, 1000, 2000, 4000, 8000].map((time) =>
      (async () => {
        const start = performance.now();
        const yieldStart = yieldCheckCounter;

        console.log(`Starting timeout check = ${time}ms`);

        await module.ANSWER(time);

        console.log(`Done timeout check = ${time}ms`);

        const elapsed = performance.now() - start;
        const yielded = yieldCheckCounter - yieldStart;

        expect(elapsed).toBeGreaterThanOrEqual(time - 50);
        expect(elapsed).toBeLessThanOrEqual(time + 150);
        expect(yielded).toBeGreaterThanOrEqual(time / 50 - 10);
      })()
    )
  );

  clearInterval(yieldCheckLoop);
}, 10000);

test("Coding 09", async () => {
  doFetchSpy(0);
  const module = await targetModules["coding-09"]();

  expect(fetchTracker.currentCount).toStrictEqual(0);
  expect(fetchTracker.totalCount).toStrictEqual(101);
  expect(fetchTracker.maxCount).toBeLessThanOrEqual(20);
  expect(module.ANSWER).toMatchSnapshot();
  expect(
    hash("MD5", stringify(module.ANSWER) ?? "", "base64url")
  ).toStrictEqual("hO5gbUqksT_EtorxIkVVhA");
}, 15000);
