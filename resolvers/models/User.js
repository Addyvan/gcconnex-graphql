
/** Class representing users with methods to retrieve information about any user on GCconnex/GCcollab. */
class User {

  /** 
   * Construct class with the mysql_db object needed to make queries
   * @param {object} mysql_db - The MySQL db connector object.
   */
  constructor(mysql_db){
    this.mysql_db = mysql_db;
  }

  /** 
   * Get a users name using their guid
   * @param {ID} guid - unique identifier.
   */
  async getName(guid){
    
    var name = await this.mysql_db.query(`SELECT name FROM elggusers_entity WHERE guid = ${guid}`);

    return name[0].name;

  }

  /** 
   * Get a users guid using their name
   * @param {string} name - the users name.
   * @todo Implement procedure for instances where two users have the same name
   */
  async getGuid(name){
    
    var guid = await this.mysql_db.query(`SELECT guid FROM elggusers_entity WHERE name LIKE "%${name}%"`);

    return guid[0].guid;
    
  }

  /** 
   * Get a users colleagues using either the user's name or guid
   * @param {object} args - object containing the GraphQL args object.
   * @todo Implement nesting by returning a User object rather than an object containing guid and name. 
   *        -> (might be best to only return guid then simply perform a look up only on the requested User fields.)
   * @todo Look into DataLoader by Facebook to optimize.
   */
  async getColleagues(args){

    if (args.guid) {
      var colleagues = await this.mysql_db.query(`
        SELECT guid_two FROM elggentity_relationships 
        WHERE guid_one = ${args.guid} AND relationship = "friend"
      `);
    }

    if (args.name) {
      var colleagues = await this.mysql_db.query(`
        SELECT guid_two FROM elggentity_relationships er
        JOIN (SELECT guid from elggusers_entity WHERE NAME LIKE "%${args.name}%") ue ON er.guid_one = ue.guid
        WHERE relationship = "friend"
      `);
    }
    
    if (!args.name && ! args.guid) {
      return [];
    }
    

    var colleagues_list = [];

    colleagues.map((row) => {
      colleagues_list.push({
        guid: row.guid_two,
        name: this.getName(row.guid_two)
      });
    })

    return colleagues_list;
    
  }

}

module.exports = User;