test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(parsedUpdatedAt).toBe(responseBody.updated_at);

  const databaseStatus = responseBody.dependencies.database;

  expect(typeof databaseStatus.version).toBe("string");
  expect(databaseStatus.version).toBe("16.0");

  expect(databaseStatus.max_connections).toBeDefined();
  expect(typeof databaseStatus.max_connections).toBe("number");
  expect(databaseStatus.max_connections).toBeGreaterThan(0);
  expect(databaseStatus.max_connections).toBe(100);

  expect(databaseStatus.opened_connections).toBeDefined();
  expect(typeof databaseStatus.opened_connections).toBe("number");
  expect(databaseStatus.opened_connections).toBeGreaterThanOrEqual(0);
  expect(databaseStatus.opened_connections).toBe(1);
});
