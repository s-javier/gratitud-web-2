import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema'

// const db = drizzle(process.env.DB_URL)

// const db = drizzle({
//   connection: process.env.DB_URL,
// })

// const db = drizzle({
//   connection: {
//     user: '...',
//     password: '...',
//     host: '...',
//     port: 4321,
//     db: '...',
//   },
// })

export default drizzle({
  connection: process.env.DB_URL ?? '',
  // logger: true,
  schema,
})
