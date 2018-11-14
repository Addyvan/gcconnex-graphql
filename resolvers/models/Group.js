/** Class representing users with methods to retrieve information about any user on GCconnex/GCcollab. */
class Group {

  /** 
   * Construct class with the mysql_db object needed to make queries
   * @param {object} mysql_db - The MySQL db connector object.
   */
  constructor(mysql_db){
    this.mysql_db = mysql_db;
  }

  /** 
   * Get a user's information given args and requested fields from the db
   * @param {object} args - unique identifier.
   * @param {array of strings} requestedFields - unique identifier.
   */
  async getGroup(args, requestedFields) {
    var parameter_string = "";
    if (args.guid) {
      parameter_string = `WHERE guid = ${args.guid}`;
    } else {
      if (args.name) {
        parameter_string = `WHERE name LIKE "%${args.name}%"`;
      }
    }

    var requestedFields_string = "";
    requestedFields.map((field, array_index) => {
      
      if (array_index < requestedFields.length - 1) {
        requestedFields_string += field + ",";
      } else {
        requestedFields_string += field;
      }
      
    });

    // This needs to be a promise to work!
    return new Promise( ( resolve, reject ) => {
      var group = this.mysql_db.query(`SELECT ${requestedFields_string} FROM elgggroups_entity ${parameter_string}`)
        .then(result => resolve(result));
    });

  }

  async getNames(array_guids){
    
    var array_guid_string = "";
    array_guids.map((guid, array_index) => {

      if (array_index < array_guids.length - 1) {
        array_guid_string += guid + ",";
      } else {
        array_guid_string += guid;
      }
      
    });
    
    var names = await this.mysql_db.query(`SELECT name FROM elggusers_entity WHERE guid IN (${array_guid_string})`);

    return names;

  }

  /** 
   * Get a users groups using either the user's name or guid
   * @param {object} args - object containing the GraphQL args object.
   * @param {array of strings} subFields - array containing desired fields of each colleague node.
   * @todo Implement nesting by returning a User object rather than an object containing guid and name. 
   *        -> (might be best to only return guid then simply perform a look up only on the requested User fields.)
   * @todo ONLY WORKS WITH NAME SO NESTING WONT WORK YET
   */
  async getMembers(args, subFields){

    if (args.guid) {
      var members = await this.mysql_db.query(`
        SELECT guid_one FROM elggentity_relationships 
        WHERE guid_two = ${args.guid} AND relationship = "member"
      `);
    }

    if (args.name) {
      var members = await this.mysql_db.query(`
        SELECT guid_one FROM elggentity_relationships er
        JOIN (SELECT guid from elgggroups_entity WHERE NAME LIKE "%${args.name}%") ue ON er.guid_two = ue.guid
        WHERE relationship = "member"
      `);
    }

    if (!args.name && ! args.guid) {
      return [];
    }
    

    var members_list = [];
    var guid_one_array = [];
    members.map((row) => {
      guid_one_array.push(row.guid_one);
    });


    if (subFields.includes("name")) {

      var names = await this.getNames(guid_one_array);

      members.map((row, index) => {
        members_list.push({
          guid: row.guid_two,
          name: names[index].name
        });
      });

    } else {
      members.map((row) => {
        members_list.push({
          guid: row.guid_two,
        });
      })
    }

    return members_list;
    
  }

}

module.exports = Group;