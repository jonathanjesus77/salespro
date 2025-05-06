import { sql } from "@vercel/postgres"

export async function executeQuery(query: string, params: any[] = []) {
  if (params.length === 0) {
    // Se não houver parâmetros, trata como simples template
    return (await sql([query])) as any
  }

  // Divide a query nos pontos $1, $2, etc.
  const parts = query.split(/\$\d+/)

  // Se o número de partes não bate com os parâmetros, erro
  if (parts.length !== params.length + 1) {
    throw new Error("Número de parâmetros não bate com placeholders na query.")
  }

  // Monta template string dinâmica com os parâmetros
  return await sql(parts as any, ...params)
}
