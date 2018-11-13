var MySQLConnector = require('./connectors/mysql');
var User = require('./models/User');

var user_model = new User(new MySQLConnector());

/**
 * @todo Implement recursion to travel through the GraphQL nested queries 
 */
function createFieldsObject(info) {
  var fields = [];
  info.fieldNodes[0].selectionSet.selections.map((fieldObj) => {
        
    if (fieldObj.selectionSet) {
      var subselections = [];
      fieldObj.selectionSet.selections.map((fieldobj) => {
        subselections.push(fieldobj.name.value);
      });
      fields.push({
        name: fieldObj.name.value,
        subFields: subselections
      });
    } else {
      fields.push({name: fieldObj.name.value});
    }

  });
  
  return fields;
}

const resolverMap = {
  Query: {

    user: (root, args, context, info) => {
      var results = {};
      var fields = createFieldsObject(info);

      // Loop through the selected fields and provide requested data given the args provided
      fields.map((field) => {
        if ( field.name === 'guid' ) {

          if ( args.guid ) {
            results.guid = args.guid; // if your input variable is guid then just use that!
          } else {
            if ( args.name ) {
              results.guid = user_model.getGuid(args.name);
            }
          }

        }

        if ( field.name === 'name' ) {

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
        if ( field.name === 'colleagues' ) {
          
          results.colleagues = user_model.getColleagues(args, field.subFields);
          
        }

      });

      return(results);
    }
  }
};

module.exports = resolverMap;