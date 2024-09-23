const db = require('../../data/dbConfig'); // Assuming you have a dbConfig for database connection

// users-model.js
// Adjust based on your database setup

function add(user) {
  return db('users')
    .insert(user) // Insert the user into the database
    .returning('*') // Return all columns of the newly inserted row
    .then(([newUser]) => {
      return {
        id: newUser, // Ensure id is returned as a string
         // Include the username
        // You can choose not to return the password for security reasons
      };
    });
}

module.exports = {
  add,
  findBy,
  // ...other methods
};

  
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
