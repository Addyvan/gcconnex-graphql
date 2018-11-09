

class User {

  constructor(mysql_db){
    this.mysql_db = mysql_db;
  }

  async getName(guid){
    
    var name = await this.mysql_db.query(`SELECT name FROM elggusers_entity WHERE guid = ${guid}`);

    return name[0].name;

  }

  async getGuid(name){
    
    var guid = await this.mysql_db.query(`SELECT guid FROM elggusers_entity WHERE name LIKE "%${name}%"`);

    return guid[0].guid;
    
  }

  async getColleagues(guid){
    
    var colleagues = await this.mysql_db.query(`
      SELECT guid FROM elggusers_entity 
      WHERE guid_one ${guid} AND relationship = "friend"
    `);
    console.log(colleagues);
    return colleagues;
    
  }

}

module.exports = User;