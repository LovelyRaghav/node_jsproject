
import {createPool} from 'mysql2';



  const Pool = createPool({
        host: '208.109.33.187',
        user: 'rmUser',
        password: 'Trayi@123',
        database: 'kabadijeeproddb',
        port : 3306,
        connectionLimit : 50
    });



export default Pool;           




