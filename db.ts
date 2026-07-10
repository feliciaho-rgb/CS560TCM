import { Client } from 'pg';

export function getDatabaseClient() {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });
}

export async function query<T>(text: string, params?: unknown[]) {
  const client = getDatabaseClient();
  await client.connect();
  try {
    const result = await client.query<T>(text, params);
    return result.rows;
  } finally {
    await client.end();
  }
}
