import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function (request, response) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({ error: "Method not allowed" });
  }
  
  const dbClient = await database.getNewClient();
  const defaultMigrationsOptions = {
    dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations"
  };
  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
    await dbClient.end();

    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false
    });

    await dbClient.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  }
}
