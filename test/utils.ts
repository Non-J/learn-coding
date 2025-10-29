import { jest } from "@jest/globals";

const sleep = (delay: number): Promise<void> =>
  new Promise((res) => setTimeout(res, delay));

const srcModules = {
  "coding-01": () => import("../src/coding-01.ts"),
  "coding-02": () => import("../src/coding-02.ts"),
  "coding-03": () => import("../src/coding-03.ts"),
  "coding-04": () => import("../src/coding-04.ts"),
  "coding-05": () => import("../src/coding-05.ts"),
  "coding-06": () => import("../src/coding-06.ts"),
  "coding-07": () => import("../src/coding-07.ts"),
  "coding-08": () => import("../src/coding-08.ts"),
  "coding-09": () => import("../src/coding-09.ts"),
  "database-01": () => import("../src/database-01.ts"),
  "database-02": () => import("../src/database-02.ts"),
  "database-03": () => import("../src/database-03.ts"),
} as const satisfies Record<keyof ImportableModules, any>;

const solutionsModules = {
  "coding-01": () => import("../solutions/coding-01.ts"),
  "coding-02": () => import("../solutions/coding-02.ts"),
  "coding-03": () => import("../solutions/coding-03.ts"),
  "coding-04": () => import("../solutions/coding-04.ts"),
  "coding-05": () => import("../solutions/coding-05.ts"),
  "coding-06": () => import("../solutions/coding-06.ts"),
  "coding-07": () => import("../solutions/coding-07.ts"),
  "coding-08": () => import("../solutions/coding-08.ts"),
  "coding-09": () => import("../solutions/coding-09.ts"),
  "database-01": () => import("../solutions/database-01.ts"),
  "database-02": () => import("../solutions/database-02.ts"),
  "database-03": () => import("../solutions/database-03.ts"),
} as const;
``;
type ImportableModules = typeof solutionsModules;

export const targetModules = (
  process.env["TEST_TARGET_SOLUTIONS"] ? solutionsModules : srcModules
) as ImportableModules;

export const moduleImportTiming = new Map<keyof ImportableModules, number>();

export const importWithTiming = async <T extends keyof ImportableModules>(
  moduleName: T
  //@ts-expect-error Too much for typechecker lol
): ReturnType<ImportableModules[T]> => {
  const start = performance.now();

  return (targetModules[moduleName]() as unknown as any).finally(() => {
    const elapsedTime = performance.now() - start;
    moduleImportTiming.set(
      moduleName,
      Math.max(elapsedTime, moduleImportTiming.get(moduleName) ?? 0)
    );
  });
};

class FetchTrackerRecord {
  totalCount: number;
  currentCount: number;
  maxCount: number;

  constructor() {
    this.totalCount = 0;
    this.currentCount = 0;
    this.maxCount = 0;
  }

  updateCount(x: number) {
    if (x > 0) this.totalCount += x;
    this.currentCount += x;
    this.maxCount = Math.max(this.maxCount, this.currentCount);
  }
}

export const fetchTracker = new FetchTrackerRecord();

export const doFetchSpy = (delay: number = 400) => {
  const fetchOriginal = globalThis.fetch;
  const fetchSpy = jest.spyOn(globalThis, "fetch");
  fetchSpy.mockImplementation(async (url, options) => {
    fetchTracker.updateCount(+1);

    const startTime = performance.now();
    try {
      const result = await fetchOriginal(url, options);
      const elapsedTime = performance.now() - startTime;
      if (elapsedTime < delay) await sleep(delay - elapsedTime);

      return result;
    } finally {
      fetchTracker.updateCount(-1);
    }
  });
};
