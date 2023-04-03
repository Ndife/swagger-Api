import lodash from 'lodash'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low  } from "lowdb";
import { JSONFile } from 'lowdb/node'

// Extend Low class with a new `chain` field
class LowWithLodash extends Low {
    chain = lodash.chain(this).get('data')
  }

// File path
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')

// Configure lowdb to write to JSONFile
const adapter = new JSONFile(file)
const db = new LowWithLodash(adapter)

// Read data from JSON file, this will set db.data content
await db.read()

// If db.json doesn't exist, db.data will be null
// the code below set default data
db.data ||= { books: [] } 

export default db;