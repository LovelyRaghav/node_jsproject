const connection = require('../db/databasesetup');

const createUser = async (userData) => {
    try {
      const [result] = await connection.execute(`
        INSERT INTO myuser (username, email, fullname, password)
        VALUES ("ghdfgverj, "dhfbjhdf, "jhsadfjbsd", "sfjwd")
      `, [userData.username, userData.email, userData.fullname, userData.password]);
      return result.insertId; // Returns the ID of the inserted user
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  };




  
  module.exports = {
    createUser,
    // Other schema methods
  };
  