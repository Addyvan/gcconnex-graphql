/** Class representing the activity feed table/object */
class ActivityFeed {

  /** 
   * Construct class with the mysql_db object needed to make queries
   * @param {object} mysql_db - The MySQL db connector object.
   */
  constructor(mysql_db) {
    this.mysql_db = mysql_db;
  }

  async getActivities(args, requestedFields) {

    var requestedFields_string = "";
    requestedFields.map((field, array_index) => {
      
      if (field === "time_posted") {
        field = "FROM_UNIXTIME(" + field + ") as " + field;
      }
      if (array_index < requestedFields.length - 1) {
        requestedFields_string += field + ",";
      } else {
        requestedFields_string += field;
      }
      
    });

    if (args.target) {
      var query = `
        SELECT ${requestedFields_string} FROM elggriver
        ${(args.first) ? "LIMIT " + args.first : ""}
      `;
    } else {
      var query  =`
        SELECT ${requestedFields_string} FROM elggriver 
        ${(args.first) ? "LIMIT " + args.first : ""}
      `;
    }

    // This needs to be a promise to work!
    return new Promise( ( resolve, reject ) => {
      this.mysql_db.query(query)
        .then(result => resolve(result));
    });
    
  }

}

module.exports = ActivityFeed;