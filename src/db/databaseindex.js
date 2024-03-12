
import {createPool} from 'mysql2';
import dotenv from 'dotenv'


dotenv.config();


const Pool  = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT), // Parse the port to ensure it's an integer
  connectionLimit: 50
})


export default Pool;

