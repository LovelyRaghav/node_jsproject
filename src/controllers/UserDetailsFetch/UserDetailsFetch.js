import { execute } from "../../db/databsesetupmysql.js";


const UserDetailsFetch = async (req, res) => {
  let SelectQuery = `select * from test.myusers`;
  try {
    let Data = await execute(SelectQuery, []);
    if (Data) {
      return res.send({data: Data})
    }
    return {error :"error"}
  } catch (error) {
    return error
  }
}

export default UserDetailsFetch