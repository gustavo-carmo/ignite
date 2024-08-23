import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.preprocess((a) => parseInt(a as string), z.number()).default(3333),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('⚠️ Invalid envoriment variables!', _env.error.format())

  throw new Error('⚠️ Invalid envoriment variables!')
}

export const env = _env.data
