var mysql = require('mysql');
var MYSQL_CREDS = require('./creds');


var con = mysql.createConnection(
  MYSQL_CREDS
);

con.connect(function(err) {
  if (err) throw err;
  console.log("MySQL db connected");
});

var getUsers = (root, { id }) => {
  con.query("SELECT guid, name  FROM elggusers_entity", function (err, result, fields) {
    if (err) throw err;
    
  });
}



export const resolvers = {
  Query: {
    users: ,
    user: 
  },
};