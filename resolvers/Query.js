var MySQLConnector = require('./connectors/mysql');
var User = require('./models/User');

var user_model = new User(new MySQLConnector());


const resolverMap = {
  Query: {

    user: (root, args, context, info) => {
      if (args.guid) {
        return ({
          guid: args.guid,
          name: user_model.getName(args.guid)
        })
      }
      if (args.name) {
        return ({
          guid: user_model.getGuid(args.name),
          name: args.name
        })
      }
    },

    colleagues: (root, args, context, info) => {
      if (args.user) {
        return ({
          colleagues: user_model.getColleagues(args.user.guid)
        })
      }
    }
  }
};

module.exports = resolverMap;