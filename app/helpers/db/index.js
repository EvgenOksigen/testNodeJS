import {Pool} from 'pg'
import connectionString from 'pg-connection-string'
var parse = connectionString.parse

const PSQL_URI = "postgres://marcus:marcus@localhost:5432/db4test"

const pool = new Pool(parse(PSQL_URI))

module.exports = {
  pool: pool,
  query: (text, params) => pool.query(text, params),
}