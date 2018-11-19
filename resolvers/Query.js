var MySQLConnector = require('./connectors/mysql');
var User = require('./models/User');
var Group = require('./models/Group');

var db = new MySQLConnector();
var user_model = new User(db);
var group_model = new Group(db);

var moement = require ('moment')


const resolverMap = {

  Date: {
    __parseValue(value) {
      return new Date(value); // value from the client
    },
    __serialize(value) {
      return moement(value).format('DD-MM-YYYY'); // value sent to the client
    },
    __parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  },

  Query: {

    user: async (root, args, context, info) => {
      console.log(root);
      console.log(args);
      console.log(context);
      console.log(info);
      var results = {};
      var fields = createFieldsObject(info); // parse the info object to get the desired fields
      var user_fields = []; // stores any fields in elggusers_entity
      
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

        if ( field.name === 'language' ) {
          
          if ( args.language ) {
            results.language = args.language;
          } else {
            user_fields.push('language');
          }

        }

        if ( field.name === 'email' ) {
          
          if ( args.email ) {
            results.email = args.email;
          } else {
            user_fields.push('email');
          }

        }

        if ( field.name === 'last_action' ) {
          
          if ( args.last_action ) {
            results.last_action = args.last_action;
          } else {
            user_fields.push('last_action');
          }

        }

        if ( field.name === 'last_login' ) {
          
          if ( args.last_login ) {
            results.last_login = args.last_login;
          } else {
            user_fields.push('last_login');
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
        if (field === "last_action" || field === "last_login")
          results[field] = user_results[0][field].toString();
        else
          results[field] = user_results[0][field];
      });
      
      return(results);
    },

    group: async (root, args, context, info) => {
      var results = {};
      var fields = createFieldsObject(info);
      var group_fields = [];

      fields.map((field) => {

        if ( field.name === 'guid' ) {

          if ( args.guid ) {
            results.guid = args.guid;
          } else {
            group_fields.push('guid');
          }

        }

        if ( field.name === 'name' ) {
          
          if ( args.name ) {
            results.name = args.name;
          } else {
            group_fields.push('name');
          }

        }

        if ( field.name === 'description' ) {
          
          if ( args.description ) {
            results.description = args.description;
          } else {
            group_fields.push('description');
          }

        }

        if ( field.name === 'members' ) {
          
          results.members = group_model.getMembers(args, field.subFields);
          
        }

      });

      group_results = await group_model.getGroup(args, group_fields);
    
      group_fields.map((field) => {
        results[field] = group_results[0][field];
      });
        
      return(results);
    }
  }

};

/**
 * Function to parse fields object and return list
 * @param {info} - GraphQL info object
 * @todo implement recursive parsing for deeply nested queries
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

module.exports = resolverMap;