const db = require('../../data/dbConfig'); // Assuming you have a dbConfig for database connection

function add(user) {
  return db('users')
    .insert(user)
    .returning('*'); // Returns the newly created user
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
