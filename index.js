const { ApolloServer, gql } = require('apollo-server');

//const schema = require('./graphql/schema');

const typeDefs = gql`

  type User {
    guid: ID!
    name: String!
    colleagues: [User]
  }

  type Query {
    user(guid: ID, name: String): User
  }

  schema {
    query: Query
  }

`;

const resolvers  = require('./resolvers/Query');

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});