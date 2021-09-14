import * as dotenv from 'dotenv';
dotenv.config()
const {PG_HOST, PG_PORT, PG_DBNAME, PG_USERNAME, PG_PASSWORD} = process.env;

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DBNAME,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl:{
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
};

export {dbOptions};