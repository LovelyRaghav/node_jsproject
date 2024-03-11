const mysql = require('mysql2');
import logger  from '../config/logger';


// exports.connection = mysql.createPool({
//     connectionLimit : 100,
//     host: "208.109.33.187",  
//   port:  3306,
//   user: "rmUser",    
//   password: "Trayi@123",
//   database: "kabadijeeproddb"
// });



const connection = mysql.createConnection({
  host: '208.109.33.187',
  user: 'rmUser',
  password: 'Trayi@123',
  database: 'kabadijeeproddb'
});

logger.info("Database connected successfully")
module.exports = connection;