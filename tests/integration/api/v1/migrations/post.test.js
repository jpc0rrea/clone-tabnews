import database from "infra/database";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

test("POST to /api/v1/migrations should execute all pending migrations", async () => {
  const getMigrationsResponse = await fetch(
    "http://localhost:3000/api/v1/migrations",
  );
  const getMigrationsResponseBody = await getMigrationsResponse.json();
  const migrationsToExecute = getMigrationsResponseBody.length;

  const postMigrationsResponse = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "POST",
    },
  );
  expect(postMigrationsResponse.status).toBe(201);

  const postMigrationsResponseBody = await postMigrationsResponse.json();
  expect(Array.isArray(postMigrationsResponseBody)).toBe(true);

  expect(postMigrationsResponseBody.length).toBe(migrationsToExecute);

  const getMigrationsResponseAfterPost = await fetch(
    "http://localhost:3000/api/v1/migrations",
  );
  const getMigrationsResponseBodyAfterPost =
    await getMigrationsResponseAfterPost.json();
  expect(getMigrationsResponseBodyAfterPost.length).toBe(0);
});
