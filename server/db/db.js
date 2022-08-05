const {Pool} = require('pg')
require('dotenv').config();
// const credentials = {
//   user: 'brandon',
//   host: 'localhost',
//   database: 'product',
//   port: process.env.PORT,

// }
const connectionString = process.env.PG_CONNECTION_STRING
const pool = new Pool({connectionString});  //pool object
pool.connect()
  .then(() => console.log("Connected")
  )
  .catch(err => console.log(err))
module.exports = pool;