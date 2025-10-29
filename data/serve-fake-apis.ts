import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { serve } from "@hono/node-server";
import { fakerEN_US as faker } from "@faker-js/faker";
import { createHash } from "node:crypto";

faker.setDefaultRefDate("2025-01-01T00:00:00.000Z");

const app = new Hono({
  getPath: (req) =>
    "/" +
    req.headers.get("host")?.replace(/^([^:]*)(?:\:\d{1,5})$/, "$1") +
    req.url.replace(/^https?:\/\/[^/]+(\/[^?]*).*/, "$1"),
});

app.use(async (c, next) => {
  console.log(`Request: ${c.req.path}, query=${JSON.stringify(c.req.query())}`);

  await new Promise((res) => setTimeout(res, Math.random() * 250 + 750));
  await next();
});

app.get("/most-wanted.fbi.com/top/:count", (c) => {
  const count = Math.max(Math.min(Number(c.req.param("count")), 1000), 0);

  faker.seed(42);

  return c.json(
    Array.from(Array(count)).map(() => {
      const idNum = faker.number
        .bigInt({
          min: 1000000000000,
          max: 9999999999999,
        })
        .toString();

      return `${idNum.substring(0, 1)}-${idNum.substring(
        1,
        5
      )}-${idNum.substring(5, 10)}-${idNum.substring(10, 12)}-${idNum.substring(
        12
      )}`;
    })
  );
});

app.get("/citizen-database.fbi.com/", (c) => {
  const id = c.req.query("citizen_id");
  if (id === undefined || id === "")
    throw new HTTPException(400, { message: "Missing citizen_id" });
  if (!/^\d-\d{4}-\d{5}-\d{2}-\d$/.test(id))
    throw new HTTPException(400, { message: "Invalid citizen_id" });

  const idNum = Number(id.replaceAll("-", ""));
  faker.seed(idNum);

  const sex = faker.person.sexType();

  return c.json({
    id: id,
    name: faker.person.fullName({ sex }),
    profile: faker.person.bio(),
    sex,
    birthday: faker.date.birthdate(),
    address: {
      address: faker.location.streetAddress({ useFullAddress: true }),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
    },
    job: faker.person.jobTitle(),
    vehicle_registrations: Array.from(Array(faker.number.int({ max: 3 }))).map(
      () => faker.vehicle.vrm()
    ),
    phones: Array.from(Array(faker.number.int({ max: 5 })))
      .fill("")
      .map(() => ({
        imei: faker.phone.imei(),
        number: faker.phone.number({ style: "international" }),
      })),
  });
});

app.get("/vehicle-database.fbi.com/", (c) => {
  const registration = c.req.query("registration");
  if (registration === undefined || registration === "")
    throw new HTTPException(400, { message: "Missing registration" });

  let hash = createHash("MD5").update(registration).digest();

  faker.seed([hash.readInt32LE(), hash.readInt32LE(4)]);

  return c.json({
    registration: registration,
    make: faker.vehicle.vehicle(),
    vin: faker.vehicle.vin(),
    color: faker.vehicle.color(),
    authority: {
      state: faker.location.state({ abbreviated: true }),
      county: faker.location.county(),
    },
  });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`API server is running on port ${info.port}`);
  }
);
