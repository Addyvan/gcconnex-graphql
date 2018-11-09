var mysql = require('mysql');
var { MYSQL_CREDS } = require('../../creds');

class MySQLConnector {
  constructor() {
    this.connection = mysql.createConnection(
      MYSQL_CREDS
    );
  }

  query( sql, args ) {
    return new Promise( ( resolve, reject ) => {
      this.connection.query( sql, args, ( err, rows ) => {
        if ( err )
          return reject( err );
        resolve( rows );
      });
    });
  }

  close() {
      return new Promise( ( resolve, reject ) => {
        this.connection.end( err => {
          if ( err )
            return reject( err );
          resolve();
        });
      });
  }

}

module.exports = MySQLConnector;