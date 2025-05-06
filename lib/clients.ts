// lib/clients.ts
import { sql } from '@vercel/postgres'

export async function getClientById(clientId: string) {
  const result = await sql`SELECT * FROM clients WHERE id = ${clientId}`
  return result.rows[0]
}
