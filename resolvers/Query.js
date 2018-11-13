var MySQLConnector = require('./connectors/mysql');
var User = require('./models/User');

var user_model = new User(new MySQLConnector());


const resolverMap = {
  Query: {

    user: (root, args, context, info) => {
      var results = {};

      // Loop through the selected fields and provide requested data given the args provided
      info.fieldNodes[0].selectionSet.selections.map((field) => {

        if ( field.name.value === 'guid' ) {

          if ( args.guid ) {
            results.guid = args.guid; // if your input variable is guid then just use that!
          } else {
            if ( args.name ) {
              results.guid = user_model.getGuid(args.name);
            }
          }

        }

        if ( field.name.value === 'name' ) {

          if ( args.name ) {
            results.name = args.name;
          } else {
            if ( args.guid ) {
              results.name = user_model.getName(args.guid);
            } else {
              results.name = "error no guid or name provided";
            }
          }

        }

        // args logic moved to the user_model function
        // Nested queries aren't implemented yet, going to look into data loader / optimization techniques first
        if ( field.name.value === 'colleagues' ) {
          
          results.colleagues = user_model.getColleagues(args);
          
        }

      });

      return(results);
    }
  }
};

module.exports = resolverMap;