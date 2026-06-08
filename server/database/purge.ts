import 'dotenv/config'
import postgres from 'postgres'

async function main() {
  const url = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/berlin'
  const sql = postgres(url, { max: 1 })

  console.log('• dropping all schemas in database…')
  const schemas = await sql<{ schema_name: string }[]>`
    SELECT schema_name
    FROM information_schema.schemata
    WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
      AND schema_name NOT LIKE 'pg_temp_%'
      AND schema_name NOT LIKE 'pg_toast_temp_%'
  `

  for (const { schema_name } of schemas) {
    await sql.unsafe(`DROP SCHEMA IF EXISTS "${schema_name}" CASCADE`)
    console.log(`  ✓ dropped schema "${schema_name}"`)
  }

  await sql.unsafe(`CREATE SCHEMA public`)
  await sql.unsafe(`GRANT ALL ON SCHEMA public TO public`)
  console.log('✓ recreated empty "public" schema')

  await sql.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
