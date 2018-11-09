const { ApolloServer, gql } = require('apollo-server');

const { schema } = require('./schema');

const { users } = require('./resolvers');


// A map of functions which return data for the schema.
const resolvers = {
  users: {
    hello: () => 'world'
  }
};

const server = new ApolloServer({
  schema,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});