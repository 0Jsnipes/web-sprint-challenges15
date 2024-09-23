const db = require('../../data/dbConfig'); // Assuming you have a dbConfig for database connection

function add(user) {
    return db('users')
      .insert(user)
      .returning('*') // This will return all columns of the inserted row
      .then(([newUser]) => {
        // Convert id to string
        return {
          ...newUser,
          id: newUser.id.toString(), // Convert ID to string
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
