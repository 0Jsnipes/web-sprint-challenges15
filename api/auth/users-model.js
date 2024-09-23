const db = require('../../data/dbConfig'); // Assuming you have a dbConfig for database connection

function add(user) {
    return db('users')
      .insert(user)
      .returning('*') // This returns all columns of the inserted row
      .then(([newUser]) => {
        // Destructure the newUser and convert id to string
        const { id , username, password } = newUser; // Destructure properties
        return {
          id: id, // Convert id to string
          username: username,
          password: password // Optionally, you might want to omit the password in the response
        };
      });
  }
  
function findBy(filter) {
  return db('users').where(filter);
}

function findById(id) {
  return db('users').where({ id }).first();
}

module.exports = {
  add,
  findBy,
  findById,
};
