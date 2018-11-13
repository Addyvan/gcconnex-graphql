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

    user: async (root, args, context, info) => {
      var results = {};
      var fields = createFieldsObject(info);
      var user_fields = []; // any fields in elggusers_entity

      // Loop through the selected fields and provide requested data given the args provided
      fields.map((field) => {
        if ( field.name === 'guid' ) {

          if ( args.guid ) {
            results.guid = args.guid;
          } else {
            user_fields.push('guid');
          }

        }

        if ( field.name === 'name' ) {
          
          if ( args.name ) {
            results.name = args.name;
          } else {
            user_fields.push('name');
          }

        }

        // args logic moved to the user_model function
        // Nested queries aren't implemented yet, going to look into data loader / optimization techniques first
        if ( field.name === 'colleagues' ) {
          
          results.colleagues = user_model.getColleagues(args, field.subFields);
          
        }

      });

      user_results = await user_model.getUser(args, user_fields);
      
      user_fields.map((field) => {
        results[field] = user_results[0][field]
      });

      return(results);
    }
  }
};

module.exports = resolverMap;